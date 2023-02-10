# React Typewriter Effect

[Demo](https://634750802.github.io/react-typewriter-effect)

## Usage

```jsx
import TypewriterEffect from "@djagger/react-typewriter-effect";
import {CSSTransition} from "react-transition-group";

<div>
  <TypewriterEffect>
    This is a simple example
  </TypewriterEffect>
  <TypewriterEffect>
    <p>
      <b>Nested</b> nodes is supported
    </p>
    <p>
      <CSSTransition classNames='awesome-transition' timeout={300}>
        <AwesomeComponent />
      </CSSTransition>
    </p>
  </TypewriterEffect>
</div>
```