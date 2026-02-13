#!/usr/bin/env node

import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const DEFAULT_SITEMAP_URL = 'https://murielcruysmans.com/sitemap.xml';
const DEFAULT_EXPECTED_HOST = 'murielcruysmans.com';
const DEFAULT_ALLOWED_NOINDEX = ['/404', '/acces'];

function parseArgs(argv) {
  const args = {
    sitemapUrl: DEFAULT_SITEMAP_URL,
    sitemapFile: '',
    expectedHost: DEFAULT_EXPECTED_HOST,
    strict: false,
    skipHttp: false,
    concurrency: 8,
    timeoutMs: 12000,
    reportPath: '',
    allowedNoindex: [...DEFAULT_ALLOWED_NOINDEX],
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === '--sitemap' && next) {
      args.sitemapUrl = next;
      i += 1;
      continue;
    }
    if (arg === '--sitemap-file' && next) {
      args.sitemapFile = next;
      i += 1;
      continue;
    }
    if (arg === '--host' && next) {
      args.expectedHost = next;
      i += 1;
      continue;
    }
    if (arg === '--concurrency' && next) {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 0) args.concurrency = parsed;
      i += 1;
      continue;
    }
    if (arg === '--timeout' && next) {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 0) args.timeoutMs = parsed;
      i += 1;
      continue;
    }
    if (arg === '--report' && next) {
      args.reportPath = next;
      i += 1;
      continue;
    }
    if (arg === '--allowed-noindex' && next) {
      args.allowedNoindex = next
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
    if (arg === '--strict') {
      args.strict = true;
      continue;
    }
    if (arg === '--skip-http') {
      args.skipHttp = true;
      continue;
    }
    if (arg === '--help') {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Sitemap QA

Usage:
  node scripts/qa-sitemap.mjs [options]

Options:
  --sitemap <url>              URL du sitemap (défaut: ${DEFAULT_SITEMAP_URL})
  --sitemap-file <path>        Fichier sitemap local (prioritaire sur --sitemap)
  --host <hostname>            Host canonique attendu (défaut: ${DEFAULT_EXPECTED_HOST})
  --strict                     Échoue aussi sur les URLs en redirection (3xx)
  --skip-http                  N'exécute pas les checks HTTP (status/noindex)
  --concurrency <n>            Concurrence HTTP (défaut: 8)
  --timeout <ms>               Timeout HTTP par requête (défaut: 12000)
  --allowed-noindex <list>     Routes autorisées en noindex, séparées par virgules
  --report <path>              Écrit un rapport JSON
  --help                       Affiche cette aide
`);
}

function parseSitemap(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/gsi)];
  return matches.map((match) => (match[1] || '').trim()).filter(Boolean);
}

function computeDuplicates(urls, normalizer) {
  const counts = new Map();
  urls.forEach((url) => {
    const key = normalizer(url);
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([url, count]) => ({ url, count }));
}

function normalizeUrlForDuplicates(value) {
  const url = new URL(value);
  url.hash = '';
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
  }

  const sortedParams = [...url.searchParams.entries()].sort(([aKey, aValue], [bKey, bValue]) => {
    const keyOrder = aKey.localeCompare(bKey);
    if (keyOrder !== 0) return keyOrder;
    return aValue.localeCompare(bValue);
  });

  url.search = '';
  sortedParams.forEach(([key, val]) => {
    url.searchParams.append(key, val);
  });

  return url.toString();
}

function listHostMismatches(urls, expectedHost) {
  return urls
    .map((loc) => {
      const parsed = new URL(loc);
      const protocolOk = parsed.protocol === 'https:';
      const hostOk = parsed.host === expectedHost;
      if (protocolOk && hostOk) return null;
      return {
        url: loc,
        protocol: parsed.protocol,
        host: parsed.host,
      };
    })
    .filter(Boolean);
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'user-agent': 'seo-sitemap-qa/1.0',
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkUrlStatus(url, timeoutMs) {
  let response = await fetchWithTimeout(url, { method: 'HEAD', redirect: 'manual' }, timeoutMs);
  if (response.status === 405 || response.status === 501) {
    response = await fetchWithTimeout(url, { method: 'GET', redirect: 'manual' }, timeoutMs);
  }

  const location = response.headers.get('location') || '';
  const isRedirect = response.status >= 300 && response.status < 400;
  const isDirect200 = response.status === 200 && !isRedirect;
  const isError = response.status < 200 || response.status >= 400;

  return {
    url,
    status: response.status,
    location,
    isRedirect,
    isDirect200,
    isError,
  };
}

function extractRobotsMetaContent(html) {
  const metaTags = html.match(/<meta[^>]+>/gim) || [];
  for (const tag of metaTags) {
    if (!/name\s*=\s*["']robots["']/i.test(tag)) continue;
    const contentMatch = tag.match(/content\s*=\s*["']([^"']+)["']/i);
    return contentMatch ? contentMatch[1] : '';
  }
  return '';
}

async function checkNoindex(url, timeoutMs) {
  const response = await fetchWithTimeout(url, { method: 'GET', redirect: 'follow' }, timeoutMs);
  const contentType = response.headers.get('content-type') || '';
  const robotsHeader = response.headers.get('x-robots-tag') || '';
  let robotsMeta = '';

  if (contentType.includes('text/html')) {
    const body = await response.text();
    robotsMeta = extractRobotsMetaContent(body);
  }

  const noindex = /noindex/i.test(robotsHeader) || /noindex/i.test(robotsMeta);
  return {
    url,
    status: response.status,
    noindex,
    robotsHeader,
    robotsMeta,
  };
}

async function mapLimit(items, limit, iteratorFn) {
  if (items.length === 0) return [];
  const cappedLimit = Math.max(1, Math.min(limit, items.length));
  const output = new Array(items.length);
  let index = 0;

  const workers = Array.from({ length: cappedLimit }, async () => {
    while (true) {
      const currentIndex = index;
      index += 1;
      if (currentIndex >= items.length) return;
      output[currentIndex] = await iteratorFn(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(workers);
  return output;
}

async function listAstroFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(rootDir, entry.name);
      if (entry.isDirectory()) return listAstroFiles(fullPath);
      if (entry.isFile() && fullPath.endsWith('.astro')) return [fullPath];
      return [];
    })
  );
  return files.flat();
}

function pageFileToRoute(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const prefix = 'src/pages/';
  if (!normalized.includes(prefix) || !normalized.endsWith('.astro')) return null;

  const relative = normalized.split(prefix)[1].replace(/\.astro$/, '');
  if (!relative || relative.includes('[')) return null;

  const parts = relative.split('/').filter(Boolean);
  if (parts[parts.length - 1] === 'index') {
    parts.pop();
  }

  const route = `/${parts.join('/')}`;
  return route === '/' ? '/' : route;
}

async function auditNoindexInSource(allowedRoutes) {
  const files = await listAstroFiles(path.join(process.cwd(), 'src/pages'));
  const detected = [];

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf8');
    if (!/robots\s*=\s*["'][^"']*noindex[^"']*["']/i.test(content)) continue;
    const route = pageFileToRoute(filePath);
    detected.push({
      file: filePath.replace(`${process.cwd()}/`, ''),
      route: route || '(dynamic-or-unknown)',
    });
  }

  const detectedRoutes = new Set(detected.map((entry) => entry.route));
  const unexpected = detected.filter((entry) => !allowedRoutes.includes(entry.route));
  const missingExpected = allowedRoutes.filter((route) => !detectedRoutes.has(route));

  return {
    detected,
    unexpected,
    missingExpected,
  };
}

function printList(title, entries, formatter = (entry) => `- ${entry}`) {
  if (!entries.length) return;
  console.log(title);
  entries.forEach((entry) => console.log(formatter(entry)));
}

async function loadSitemapContent(config) {
  if (config.sitemapFile) {
    return readFile(path.resolve(config.sitemapFile), 'utf8');
  }

  const response = await fetchWithTimeout(
    config.sitemapUrl,
    { method: 'GET', redirect: 'follow' },
    config.timeoutMs
  );

  if (!response.ok) {
    throw new Error(`Impossible de charger le sitemap (${response.status})`);
  }
  return response.text();
}

async function main() {
  const config = parseArgs(process.argv.slice(2));
  const report = {
    generatedAt: new Date().toISOString(),
    config: {
      sitemapUrl: config.sitemapUrl,
      sitemapFile: config.sitemapFile || null,
      expectedHost: config.expectedHost,
      strict: config.strict,
      skipHttp: config.skipHttp,
      concurrency: config.concurrency,
      timeoutMs: config.timeoutMs,
      allowedNoindex: config.allowedNoindex,
    },
    summary: {},
    findings: {},
  };

  console.log('SEO QA Sitemap - démarrage');
  console.log(`- Host attendu: ${config.expectedHost}`);
  console.log(`- Mode strict: ${config.strict ? 'oui' : 'non'}`);
  console.log(`- HTTP checks: ${config.skipHttp ? 'non' : 'oui'}`);

  const sourceNoindex = await auditNoindexInSource(config.allowedNoindex);
  report.findings.sourceNoindex = sourceNoindex;

  const sitemapXml = await loadSitemapContent(config);
  const urls = parseSitemap(sitemapXml);
  if (!urls.length) {
    throw new Error('Aucune URL <loc> trouvée dans le sitemap.');
  }

  const exactDuplicates = computeDuplicates(urls, (value) => value);
  const normalizedDuplicates = computeDuplicates(urls, normalizeUrlForDuplicates);
  const hostMismatches = listHostMismatches(urls, config.expectedHost);

  report.findings.exactDuplicates = exactDuplicates;
  report.findings.normalizedDuplicates = normalizedDuplicates;
  report.findings.hostMismatches = hostMismatches;

  let statusChecks = [];
  let noindexOnIndexable = [];
  let requiredNoindexMissing = [];

  if (!config.skipHttp) {
    statusChecks = await mapLimit(urls, config.concurrency, (url) => checkUrlStatus(url, config.timeoutMs));
    report.findings.statusChecks = statusChecks;

    noindexOnIndexable = await mapLimit(urls, config.concurrency, (url) => checkNoindex(url, config.timeoutMs))
      .then((results) => results.filter((result) => result.noindex));
    report.findings.noindexOnIndexable = noindexOnIndexable;

    const baseOrigin = new URL(config.sitemapUrl).origin;
    const requiredNoindexUrls = config.allowedNoindex.map((route) => new URL(route, baseOrigin).toString());
    const requiredNoindexChecks = await mapLimit(
      requiredNoindexUrls,
      Math.min(config.concurrency, requiredNoindexUrls.length || 1),
      (url) => checkNoindex(url, config.timeoutMs)
    );
    requiredNoindexMissing = requiredNoindexChecks.filter((result) => !result.noindex);
    report.findings.requiredNoindexChecks = requiredNoindexChecks;
    report.findings.requiredNoindexMissing = requiredNoindexMissing;
  }

  const redirects = statusChecks.filter((result) => result.isRedirect);
  const non200 = statusChecks.filter((result) => !result.isDirect200);
  const hardErrors = statusChecks.filter((result) => result.isError);

  const failures = [];
  const warnings = [];

  if (sourceNoindex.unexpected.length > 0) {
    failures.push(`Pages source avec noindex non autorisé: ${sourceNoindex.unexpected.length}`);
  }
  if (sourceNoindex.missingExpected.length > 0) {
    failures.push(`Pages attendues en noindex manquantes: ${sourceNoindex.missingExpected.length}`);
  }
  if (exactDuplicates.length > 0) {
    failures.push(`Doublons exacts dans sitemap: ${exactDuplicates.length}`);
  }
  if (normalizedDuplicates.length > 0) {
    failures.push(`Doublons normalisés (ex: slash final): ${normalizedDuplicates.length}`);
  }
  if (hostMismatches.length > 0) {
    failures.push(`Host/protocole non canonique: ${hostMismatches.length}`);
  }
  if (!config.skipHttp) {
    if (hardErrors.length > 0) {
      failures.push(`URLs en erreur HTTP (4xx/5xx/etc): ${hardErrors.length}`);
    }
    if (config.strict && redirects.length > 0) {
      failures.push(`URLs sitemap en redirection (strict): ${redirects.length}`);
    } else if (redirects.length > 0) {
      warnings.push(`URLs sitemap en redirection: ${redirects.length}`);
    }
    if (!config.strict && non200.length > 0) {
      warnings.push(`URLs sitemap non 200 direct: ${non200.length}`);
    }
    if (noindexOnIndexable.length > 0) {
      failures.push(`Pages indexables marquées noindex: ${noindexOnIndexable.length}`);
    }
    if (requiredNoindexMissing.length > 0) {
      failures.push(`Pages sensibles sans noindex: ${requiredNoindexMissing.length}`);
    }
  }

  report.summary = {
    urlsTotal: urls.length,
    failuresCount: failures.length,
    warningsCount: warnings.length,
    redirectsCount: redirects.length,
    hardErrorsCount: hardErrors.length,
    hostMismatchCount: hostMismatches.length,
    exactDuplicateCount: exactDuplicates.length,
    normalizedDuplicateCount: normalizedDuplicates.length,
    sourceNoindexUnexpectedCount: sourceNoindex.unexpected.length,
    sourceNoindexMissingExpectedCount: sourceNoindex.missingExpected.length,
    noindexOnIndexableCount: noindexOnIndexable.length,
    requiredNoindexMissingCount: requiredNoindexMissing.length,
  };

  console.log(`- URLs sitemap: ${urls.length}`);
  console.log(`- Doublons exacts: ${exactDuplicates.length}`);
  console.log(`- Doublons normalisés: ${normalizedDuplicates.length}`);
  console.log(`- Mismatch host/protocole: ${hostMismatches.length}`);
  if (!config.skipHttp) {
    console.log(`- URLs en redirection: ${redirects.length}`);
    console.log(`- URLs en erreur HTTP: ${hardErrors.length}`);
    console.log(`- Pages indexables noindex: ${noindexOnIndexable.length}`);
    console.log(`- Pages sensibles sans noindex: ${requiredNoindexMissing.length}`);
  }

  printList('\nDétails - noindex source inattendu', sourceNoindex.unexpected, (entry) => `- ${entry.route} (${entry.file})`);
  printList('\nDétails - noindex source manquant', sourceNoindex.missingExpected, (entry) => `- ${entry}`);
  printList('\nDétails - host/protocole mismatch', hostMismatches, (entry) => `- ${entry.url} (host=${entry.host}, protocol=${entry.protocol})`);
  printList('\nDétails - doublons exacts', exactDuplicates, (entry) => `- ${entry.url} x${entry.count}`);
  printList('\nDétails - doublons normalisés', normalizedDuplicates, (entry) => `- ${entry.url} x${entry.count}`);
  printList('\nDétails - erreurs HTTP', hardErrors, (entry) => `- ${entry.url} => ${entry.status}`);
  if (!config.strict) {
    printList('\nDétails - URLs en redirection', redirects, (entry) => `- ${entry.url} => ${entry.status} ${entry.location}`);
  }

  if (config.reportPath) {
    const absoluteReportPath = path.resolve(config.reportPath);
    await mkdir(path.dirname(absoluteReportPath), { recursive: true });
    await writeFile(absoluteReportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`\nRapport écrit: ${config.reportPath}`);
  }

  if (warnings.length) {
    console.log('\nWARNINGS');
    warnings.forEach((warning) => console.log(`- ${warning}`));
  }

  if (failures.length) {
    console.log('\nFAILURES');
    failures.forEach((failure) => console.log(`- ${failure}`));
    process.exit(1);
  }

  console.log('\nOK - QA sitemap terminée sans anomalie bloquante.');
}

main().catch((error) => {
  console.error('Erreur QA sitemap:', error instanceof Error ? error.message : error);
  process.exit(1);
});
