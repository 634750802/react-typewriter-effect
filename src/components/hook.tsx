import { cloneElement, ReactElement, useEffect, useState } from 'react';
import { appendClassName, effectScopeTimeout, nextIndex, useMemorizedFn } from './utils';

export interface TypewriterModelText {
  type: 'text';
  content: string;
  html?: boolean;
  element: ReactElement;
}

export interface TypewriterModelRawText {
  type: 'raw-text';
  content: string;
}

export interface TypewriterModelRaw {
  type: 'raw';
  element: boolean | null | undefined;
}

export interface TypewriterModelElement {
  type: 'element';
  element: ReactElement;
  transition: boolean;
  onEnter?: () => void;
  onEntered?: () => void;
}

export type TypewriterModel = TypewriterModelElement | TypewriterModelText | TypewriterModelRawText | TypewriterModelRaw;

export interface TypewriterOptions {
  paused?: boolean;
  timeout?: number | ((model: TypewriterModel, i: number) => number);
}

export function useTypewriter (models: TypewriterModel[], { paused = false, timeout = () => 50 }: TypewriterOptions = {}, onFinished?: () => void) {
  const [part, setPart] = useState(0);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (paused) {
      return;
    }
    if (part < models.length) {
      const model = models[part];
      if (model.type === 'element' || model.type === 'raw') {
        // directly add element
        return effectScopeTimeout(() => {
          setI(0);
          setPart(part + 1);
        }, getValue(timeout, models[part + 1], 0));
      } else if (i < model.content.length) {
        // move to next character
        const nextI = nextIndex(model.content, i);
        return effectScopeTimeout(() => {
          setI(nextI);
        }, getValue(timeout, model, i));
      } else {
        // move to next element
        return effectScopeTimeout(() => {
          setI(0);
          setPart(part + 1);
        }, getValue(timeout, model, 0));
      }
    } else {
      onFinished?.();
    }
  }, [paused, part, i]);

  const render = useMemorizedFn(() => {
    return models.slice(0, part + 1).map((model, partIndex) => {
      if (model.type === 'element') {
        if (model.transition) {
          return (
            <TransitionWrapper key={model.element.key ?? `typewriter-part-${partIndex}`}>
              {cloneElement(model.element, {
                onEnter: model.onEnter,
                onEntered: model.onEntered,
              })}
            </TransitionWrapper>
          );
        } else {
          return cloneElement(model.element, {
            key: model.element.key ?? `typewriter-part-${partIndex}`,
          });
        }
      } else if (model.type === 'raw') {
        return model.element;
      }

      const { content } = model;
      const contentString = partIndex === part ? content.slice(0, i) : content;

      if (model.type === 'raw-text') {
        return contentString;
      }

      const { html, element } = model;
      const className = partIndex === part ? 'typewriter-focused' : undefined;
      if (html) {
        return cloneElement(element, {
          key: element.key ?? `typewriter-part-${partIndex}`,
          className: appendClassName(element.props.className, className),
          dangerouslySetInnerHTML: { __html: contentString },
        });
      } else {
        return cloneElement(element, {
          key: element.key ?? `typewriter-part-${partIndex}`,
          className: appendClassName(element.props.className, className),
          children: contentString,
        });
      }
    });
  });

  return {
    render,
  };
}

function getValue<T extends Exclude<any, Function>> (valueOrGetter: T | ((model: TypewriterModel, i: number) => T), model: TypewriterModel, i: number): T {
  if (typeof valueOrGetter === 'function') {
    return (valueOrGetter as ((model: TypewriterModel, i: number) => T))(model, i);
  } else {
    return valueOrGetter;
  }
}

function TransitionWrapper ({ children }: { children: ReactElement }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  return cloneElement(children, { in: show });
}
