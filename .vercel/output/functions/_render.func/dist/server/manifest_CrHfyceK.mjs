import 'piccolore';
import { q as decodeKey } from './chunks/astro/server_YGNefyes.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_YeEK_njS.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/ryelandt/Documents/site%20maman/","cacheDir":"file:///Users/ryelandt/Documents/site%20maman/node_modules/.astro/","outDir":"file:///Users/ryelandt/Documents/site%20maman/dist/","srcDir":"file:///Users/ryelandt/Documents/site%20maman/src/","publicDir":"file:///Users/ryelandt/Documents/site%20maman/public/","buildClientDir":"file:///Users/ryelandt/Documents/site%20maman/dist/client/","buildServerDir":"file:///Users/ryelandt/Documents/site%20maman/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"about/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index-cms/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/index-cms","isIndex":false,"type":"page","pattern":"^\\/index-cms\\/?$","segments":[[{"content":"index-cms","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/index-cms.astro","pathname":"/index-cms","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"recettes/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/recettes","isIndex":false,"type":"page","pattern":"^\\/recettes\\/?$","segments":[[{"content":"recettes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/recettes.astro","pathname":"/recettes","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"test/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/test","isIndex":false,"type":"page","pattern":"^\\/test\\/?$","segments":[[{"content":"test","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/test.astro","pathname":"/test","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"thermomix/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/thermomix","isIndex":false,"type":"page","pattern":"^\\/thermomix\\/?$","segments":[[{"content":"thermomix","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/thermomix.astro","pathname":"/thermomix","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/newsletter","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/newsletter\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"newsletter","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/newsletter.ts","pathname":"/api/newsletter","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/ryelandt/Documents/site maman/src/pages/test.astro",{"propagation":"none","containsHead":true}],["/Users/ryelandt/Documents/site maman/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/Users/ryelandt/Documents/site maman/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/Users/ryelandt/Documents/site maman/src/pages/index-cms.astro",{"propagation":"none","containsHead":true}],["/Users/ryelandt/Documents/site maman/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/ryelandt/Documents/site maman/src/pages/recette/[slug].astro",{"propagation":"none","containsHead":true}],["/Users/ryelandt/Documents/site maman/src/pages/recettes.astro",{"propagation":"none","containsHead":true}],["/Users/ryelandt/Documents/site maman/src/pages/thermomix.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/api/newsletter@_@ts":"pages/api/newsletter.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:src/pages/index-cms@_@astro":"pages/index-cms.astro.mjs","\u0000@astro-page:src/pages/recette/[slug]@_@astro":"pages/recette/_slug_.astro.mjs","\u0000@astro-page:src/pages/recettes@_@astro":"pages/recettes.astro.mjs","\u0000@astro-page:src/pages/test@_@astro":"pages/test.astro.mjs","\u0000@astro-page:src/pages/thermomix@_@astro":"pages/thermomix.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CrHfyceK.mjs","/Users/ryelandt/Documents/site maman/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_BXWlWFPF.mjs","/Users/ryelandt/Documents/site maman/src/lib/sanity.ts":"chunks/sanity_Cgp3KnYp.mjs","/Users/ryelandt/Documents/site maman/src/pages/contact.astro?astro&type=script&index=0&lang.ts":"_astro/contact.astro_astro_type_script_index_0_lang.CV4kB8p5.js","/Users/ryelandt/Documents/site maman/src/pages/recettes.astro?astro&type=script&index=0&lang.ts":"_astro/recettes.astro_astro_type_script_index_0_lang.CcARCZP2.js","/Users/ryelandt/Documents/site maman/src/components/NewsletterSignup.astro?astro&type=script&index=0&lang.ts":"_astro/NewsletterSignup.astro_astro_type_script_index_0_lang.BHiwCihc.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/ryelandt/Documents/site maman/src/pages/contact.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",function(){const n=document.getElementById(\"contactForm\"),c=document.getElementById(\"submitBtn\"),l=document.getElementById(\"btnText\"),m=document.getElementById(\"btnSpinner\"),u=document.getElementById(\"successMessage\"),f=document.getElementById(\"errorMessage\"),o=n.querySelectorAll(\"input, select, textarea\");o.forEach(r=>{r.addEventListener(\"blur\",function(){i(this)}),r.addEventListener(\"input\",function(){this.classList.contains(\"border-red-500\")&&i(this)})});function i(r){const s=r.value.trim();let e=!0,a=\"\";switch(r.classList.remove(\"border-red-500\",\"border-green-500\"),r.classList.add(\"border-gray-300\"),r.name){case\"name\":s?s.length<2&&(e=!1,a=\"Le nom doit contenir au moins 2 caractères\"):(e=!1,a=\"Le nom est requis\");break;case\"email\":s?/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(s)||(e=!1,a=\"Format d'email invalide\"):(e=!1,a=\"L'email est requis\");break;case\"phone\":s&&!/^[\\+]?[0-9\\s\\-\\(\\)]{10,}$/.test(s.replace(/\\s/g,\"\"))&&(e=!1,a=\"Format de téléphone invalide\");break;case\"subject\":s||(e=!1,a=\"Veuillez choisir un sujet\");break;case\"message\":s?s.length<10&&(e=!1,a=\"Le message doit contenir au moins 10 caractères\"):(e=!1,a=\"Le message est requis\");break}let t=r.parentNode.querySelector(\".field-error\");return e?(r.classList.remove(\"border-gray-300\",\"border-red-500\"),r.classList.add(\"border-green-500\"),t&&t.remove()):(r.classList.remove(\"border-gray-300\"),r.classList.add(\"border-red-500\"),t||(t=document.createElement(\"p\"),t.className=\"field-error text-red-600 text-sm mt-1\",r.parentNode.appendChild(t)),t.textContent=a),e}n.addEventListener(\"submit\",async function(r){r.preventDefault();let s=!0;if(o.forEach(e=>{i(e)||(s=!1)}),!s){const e=n.querySelector(\".border-red-500\");e&&e.scrollIntoView({behavior:\"smooth\",block:\"center\"});return}c.disabled=!0,l.classList.add(\"hidden\"),m.classList.remove(\"hidden\"),u.classList.add(\"hidden\"),f.classList.add(\"hidden\");try{await new Promise(t=>setTimeout(t,2e3));const e=new FormData(n),a=Object.fromEntries(e.entries());if(console.log(\"Données du formulaire:\",a),Math.random()>.1)u.classList.remove(\"hidden\"),n.reset(),o.forEach(t=>{t.classList.remove(\"border-green-500\",\"border-red-500\"),t.classList.add(\"border-gray-300\");const d=t.parentNode.querySelector(\".field-error\");d&&d.remove()});else throw new Error(\"Erreur de réseau\")}catch(e){console.error(\"Erreur lors de l'envoi:\",e),f.classList.remove(\"hidden\")}finally{c.disabled=!1,l.classList.remove(\"hidden\"),m.classList.add(\"hidden\")}}),o.forEach(r=>{r.addEventListener(\"invalid\",function(s){s.preventDefault(),i(this)})})});"],["/Users/ryelandt/Documents/site maman/src/pages/recettes.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",function(){const f=document.getElementById(\"search-input\"),r=document.querySelectorAll(\".filter-btn\"),l=document.querySelectorAll(\".recipe-card\"),n=document.getElementById(\"recipes-grid\");let i=\"all\",o=\"\";function c(){let t=0;if(l.forEach(e=>{const s=e.dataset.title||\"\",d=e.dataset.description||\"\",a=e.dataset.tags||\"\";e.dataset.category;const g=o===\"\"||s.includes(o)||d.includes(o)||a.includes(o);let u=!1;i===\"all\"?u=!0:u=a.includes(i.toLowerCase()),g&&u?(e.style.display=\"block\",t++):e.style.display=\"none\"}),t===0){if(!n.querySelector(\".no-results\")){const e=document.createElement(\"div\");e.className=\"no-results col-span-full text-center py-16\",e.innerHTML=`\n              <div class=\"max-w-md mx-auto\">\n                <svg class=\"mx-auto h-24 w-24 text-vert-foret-doux mb-8\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n                  <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.966-5.5-2.5\"/>\n                </svg>\n                <h3 class=\"text-2xl font-serif font-bold text-vert-foret mb-4\">\n                  Aucune recette trouvée\n                </h3>\n                <p class=\"text-gray-600 mb-6\">\n                  Essayez de modifier vos critères de recherche ou de filtre.\n                </p>\n                <button onclick=\"resetFilters()\" class=\"bg-vert-foret text-white px-6 py-3 rounded-lg font-medium hover:bg-vert-foret-doux transition-colors\">\n                  Voir toutes les recettes\n                </button>\n              </div>\n            `,n.appendChild(e)}}else{const e=n.querySelector(\".no-results\");e&&e.remove()}v()}function v(){r.forEach(t=>{const e=t.dataset.filter;let s=0;e===\"all\"?s=l.length:l.forEach(a=>{(a.dataset.tags||\"\").includes(e.toLowerCase())&&s++});const d=t.textContent.replace(/\\s*\\(\\d+\\)$/,\"\");t.textContent=`${d} (${s})`})}window.resetFilters=function(){i=\"all\",o=\"\",f.value=\"\",r.forEach(t=>{t.classList.remove(\"active\",\"bg-vert-foret\",\"text-white\"),t.classList.add(\"bg-gray-200\",\"text-gray-700\")}),r[0].classList.add(\"active\",\"bg-vert-foret\",\"text-white\"),r[0].classList.remove(\"bg-gray-200\",\"text-gray-700\"),c()},f.addEventListener(\"input\",function(t){o=t.target.value.toLowerCase().trim(),c()}),r.forEach(t=>{t.addEventListener(\"click\",function(){const e=this.dataset.filter;r.forEach(s=>{s.classList.remove(\"active\",\"bg-vert-foret\",\"text-white\"),s.classList.add(\"bg-gray-200\",\"text-gray-700\")}),this.classList.add(\"active\",\"bg-vert-foret\",\"text-white\"),this.classList.remove(\"bg-gray-200\",\"text-gray-700\"),i=e,c()})}),r[0].classList.add(\"active\")});"],["/Users/ryelandt/Documents/site maman/src/components/NewsletterSignup.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",()=>{const m=document.getElementById(\"newsletter-form\"),o=document.getElementById(\"newsletter-email\"),a=document.getElementById(\"newsletter-submit\"),t=document.getElementById(\"newsletter-message\"),n=(e,s=!1)=>{t.textContent=e,t.className=`text-sm mt-2 transition-opacity ${s?\"text-red-600\":\"text-green-600\"}`,t.style.opacity=\"1\",setTimeout(()=>{t.style.opacity=\"0\"},5e3)},i=e=>{a.disabled=e,a.textContent=e?\"Inscription...\":\"S'inscrire\"};m.addEventListener(\"submit\",async e=>{e.preventDefault();const s=o.value.trim();if(!s){n(\"Veuillez saisir votre adresse email\",!0);return}i(!0);try{const r=await fetch(\"/api/newsletter\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:s})}),l=await r.json();r.ok?(n(l.message),o.value=\"\"):n(l.error||\"Une erreur est survenue\",!0)}catch(r){console.error(\"Erreur:\",r),n(\"Erreur de connexion. Veuillez réessayer.\",!0)}finally{i(!1)}})});"]],"assets":["/_astro/about.C4sN-tRf.css","/favicon.ico","/favicon.svg","/images/Asset 4logo.png","/about/index.html","/contact/index.html","/index-cms/index.html","/recettes/index.html","/test/index.html","/thermomix/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"+EUC1ydIbxsWyyzJn6mKH24cn6pgzxpB/qpmyRmtVcw="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
