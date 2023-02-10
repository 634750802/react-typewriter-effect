import { cloneElement, DependencyList, isValidElement, PropsWithChildren, ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { TypewriterModel, TypewriterOptions } from './hook';
import TypewriterEffectInternal, { TypewriterEffectInternalProps } from './TypewriterEffectInternal';
import { isTransition, useMemorizedFn } from './utils';
import './cursor.css';

export interface TypewriterEffectProps extends Omit<TypewriterEffectInternalProps, 'models' | 'paused'>, Pick<TransformOptions, 'isTransition'> {
  children: ReactNode;
  recursive?: boolean;
  deps?: DependencyList;
  onStarted?: () => void;
}

export default function TypewriterEffect ({ deps, recursive, children, onFinished, onStarted, ...options }: TypewriterEffectProps) {
  const [paused, setPaused] = useState(false);
  const handleSubTransitionEnter = useMemorizedFn(() => {
    setPaused(true);
  });

  const handleSubTransitionEntered = useMemorizedFn(() => {
    setPaused(false);
  });

  const models = useTransform(children, {
    ...options,
    recursive,
    deps,
    onSubTransitionEntered: handleSubTransitionEntered,
    onSubTransitionEnter: handleSubTransitionEnter,
  });
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    onStarted?.();
  }, []);

  const handleFinished = useMemorizedFn(() => {
    setFinished(true);
    onFinished?.();
  });

  if (finished) {
    return <>{children}</>;
  } else {
    return (
      <TypewriterEffectInternal models={models} onFinished={handleFinished} paused={paused} {...options} />
    );
  }
}

type TransformOptions = {
  deps?: DependencyList
  recursive?: boolean
  isTransition?: (element: ReactElement) => boolean
  onSubTransitionEnter: () => void
  onSubTransitionEntered: () => void
} & TypewriterOptions

function useTransform (children: ReactNode, options: Omit<TransformOptions, 'paused'>): TypewriterModel[] {
  return useMemo(() => {
    return transformReactNode(children, options);
  }, options.deps);
}

function transformReactNode (node: ReactNode, options: Omit<TransformOptions, 'paused'>): TypewriterModel[] {
  const { onSubTransitionEnter, onSubTransitionEntered, isTransition: overrideIsTransition, ...internalOptions } = options;
  if (node == null) {
    return [];
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return [{
      type: 'raw-text',
      content: String(node),
    }];
  }
  if (typeof node === 'boolean') {
    return [{
      type: 'raw',
      element: node,
    }];
  }
  if (isValidElement(node)) {
    if (typeof node.props.children === 'string') {
      return [{
        type: 'text',
        element: node,
        content: node.props.children,
      }];
    } else {
      let isTransitionElement = (overrideIsTransition ?? isTransition)(node);
      if (options.recursive && ('children' in node.props) && !isTransitionElement) {
        // if recursive and have children
        return [{
          type: 'element',
          element: cloneElement(node as ReactElement<PropsWithChildren>, {
            children: (
              <TypewriterEffect
                {...internalOptions}
                onStarted={onSubTransitionEnter}
                onFinished={onSubTransitionEntered}
              >
                {node.props.children}
              </TypewriterEffect>
            ),
          }),
          transition: false,
        }];
      } else {
        if (isTransitionElement) {
          return [{
            type: 'element',
            element: node,
            transition: true,
            onEnter: onSubTransitionEnter,
            onEntered: onSubTransitionEntered,
          }];
        } else {
          return [{
            type: 'element',
            element: node,
            transition: false,
          }];
        }
      }
    }
  }
  const result: TypewriterModel[] = [];
  for (const child of node) {
    result.push(...transformReactNode(child, options));
  }
  return result;
}
