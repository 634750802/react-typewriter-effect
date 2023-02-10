import { ReactElement, useMemo, useRef } from 'react';

export function useMemorizedFn<Args extends any[], Returns> (fn: (...args: Args) => Returns): (...args: Args) => Returns {
  const ref = useRef<(...args: Args) => Returns>(fn);
  ref.current = fn;

  return useMemo(() => {
    return (...args: Args): Returns => {
      return ref.current(...args);
    };
  }, []);
}

export function appendClassName (a: string | undefined, b: string | undefined) {
  return [a, b].filter(String).join(' ');
}

export function effectScopeTimeout (cb: () => void, timeout: number) {
  const h = setTimeout(cb, timeout);
  return () => clearTimeout(h);
}

export function nextIndex (content: string, currentIndex: number) {
  return Math.min(content.length, currentIndex + 1);
}

export function isTransition (element: ReactElement): element is ReactElement<{ in?: boolean, onEnter?: () => void, onEntered?: () => void }> {
  if (typeof element.type === 'string') {
    return false;
  }
  if ('propTypes' in element.type && element.type.propTypes && typeof element.type.propTypes === 'object') {
    return 'onEnter' in element.type.propTypes && 'onEntered' in element.type.propTypes;
  }
  return true;
}
