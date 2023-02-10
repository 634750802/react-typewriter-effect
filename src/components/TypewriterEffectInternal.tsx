import { TypewriterModel, TypewriterOptions, useTypewriter } from './hook';

export interface TypewriterEffectInternalProps extends TypewriterOptions {
  models: TypewriterModel[];
  onFinished?: () => void;
}

export default function TypewriterEffectInternal ({ models, onFinished, ...options }: TypewriterEffectInternalProps) {
  const { render } = useTypewriter(models, options, onFinished);

  return <>{render()}</>;
}