const escapeHtml = (value = '') =>
  value
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const sanitizeUrl = (href = '') => {
  const url = href.toString().trim();
  if (!url) return '';
  if (
    url.startsWith('/') ||
    url.startsWith('#') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:') ||
    /^https?:\/\//i.test(url)
  ) {
    return url;
  }
  return '';
};

const renderMarks = (text, marks = [], markDefs = []) => {
  if (!marks.length) return text;
  let output = text;
  const defsByKey = new Map(
    (markDefs || []).map((def) => [def?._key, def])
  );

  marks.forEach((mark) => {
    if (mark === 'strong') {
      output = `<strong>${output}</strong>`;
      return;
    }
    if (mark === 'em') {
      output = `<em>${output}</em>`;
      return;
    }
    if (mark === 'underline') {
      output = `<span class="underline">${output}</span>`;
      return;
    }
    if (mark === 'code') {
      output = `<code class="px-1 py-0.5 rounded bg-mv-cream text-mv-forest">${output}</code>`;
      return;
    }

    const def = defsByKey.get(mark);
    if (def?._type === 'link') {
      const safeUrl = sanitizeUrl(def.href);
      if (!safeUrl) return;
      const isExternal = /^https?:\/\//i.test(safeUrl);
      const rel = isExternal ? ' rel="noopener noreferrer"' : '';
      const target = isExternal ? ' target="_blank"' : '';
      output = `<a href="${safeUrl}" class="text-mv-leaf underline underline-offset-4 hover:text-mv-forest"${target}${rel}>${output}</a>`;
    }
  });

  return output;
};

const renderBlockChildren = (children = [], markDefs = []) =>
  children
    .map((child) => {
      if (child?._type !== 'span') return '';
      const escaped = escapeHtml(child.text || '').replace(/\n/g, '<br />');
      return renderMarks(escaped, child.marks || [], markDefs);
    })
    .join('');

const renderBlock = (block) => {
  if (!block || block._type !== 'block') return '';
  const content = renderBlockChildren(block.children || [], block.markDefs || []);
  const style = block.style || 'normal';

  switch (style) {
    case 'h2':
      return `<h2 class="text-xl sm:text-2xl font-serif font-bold text-mv-forest mt-6">${content}</h2>`;
    case 'h3':
      return `<h3 class="text-lg sm:text-xl font-serif font-semibold text-mv-forest mt-5">${content}</h3>`;
    case 'h4':
      return `<h4 class="text-base sm:text-lg font-serif font-semibold text-mv-forest mt-4">${content}</h4>`;
    case 'blockquote':
      return `<blockquote class="border-l-2 border-mv-leaf-30 pl-4 text-mv-forest-70 italic">${content}</blockquote>`;
    case 'normal':
    default:
      return `<p class="text-sm sm:text-base text-mv-forest-80 leading-relaxed">${content}</p>`;
  }
};

export const renderPortableText = (blocks = []) => {
  if (!Array.isArray(blocks)) return '';
  let html = '';
  let currentList = null;

  blocks.forEach((block) => {
    if (block?._type === 'block' && block.listItem) {
      const listTag = block.listItem === 'number' ? 'ol' : 'ul';
      if (!currentList) {
        const listClass =
          listTag === 'ol'
            ? 'list-decimal list-inside space-y-2 text-sm sm:text-base text-mv-forest-80'
            : 'list-disc list-inside space-y-2 text-sm sm:text-base text-mv-forest-80';
        html += `<${listTag} class="${listClass}">`;
        currentList = listTag;
      } else if (currentList !== listTag) {
        html += `</${currentList}><${listTag} class="list-disc list-inside space-y-2 text-sm sm:text-base text-mv-forest-80">`;
        currentList = listTag;
      }

      const itemContent = renderBlockChildren(
        block.children || [],
        block.markDefs || []
      );
      html += `<li>${itemContent}</li>`;
      return;
    }

    if (currentList) {
      html += `</${currentList}>`;
      currentList = null;
    }

    html += renderBlock(block);
  });

  if (currentList) {
    html += `</${currentList}>`;
  }

  return html;
};
