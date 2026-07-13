/**
 * Dependency-free text splitter (a free stand-in for GSAP SplitText).
 * Wraps each line/word/char in spans so they can be animated individually,
 * with an inner masked wrapper enabling clip-style reveals.
 */

export type SplitType = 'chars' | 'words' | 'lines';

interface SplitResult {
  elements: HTMLElement[];
  revert: () => void;
}

function makeWrap(inner: HTMLElement, kind: string): HTMLElement {
  const outer = document.createElement('span');
  outer.className = `split-${kind}`;
  outer.style.display = 'inline-block';
  outer.style.overflow = 'hidden';
  outer.style.verticalAlign = 'top';

  inner.style.display = 'inline-block';
  inner.style.willChange = 'transform';
  outer.appendChild(inner);
  return outer;
}

export function splitText(el: HTMLElement, type: SplitType = 'words'): SplitResult {
  const original = el.innerHTML;
  const text = el.textContent ?? '';
  el.innerHTML = '';
  el.setAttribute('aria-label', text);

  const elements: HTMLElement[] = [];

  if (type === 'chars') {
    for (const ch of text) {
      const inner = document.createElement('span');
      inner.textContent = ch === ' ' ? ' ' : ch;
      inner.setAttribute('aria-hidden', 'true');
      const wrap = makeWrap(inner, 'char');
      el.appendChild(wrap);
      elements.push(inner);
    }
  } else {
    // words
    const words = text.split(/(\s+)/);
    for (const word of words) {
      if (word.trim() === '') {
        el.appendChild(document.createTextNode(word));
        continue;
      }
      const inner = document.createElement('span');
      inner.textContent = word;
      inner.setAttribute('aria-hidden', 'true');
      const wrap = makeWrap(inner, 'word');
      el.appendChild(wrap);
      elements.push(inner);
    }
  }

  return {
    elements,
    revert: () => {
      el.innerHTML = original;
      el.removeAttribute('aria-label');
    },
  };
}
