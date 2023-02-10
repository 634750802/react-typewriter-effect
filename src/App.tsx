import { useRef, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import TypewriterEffect from './components/TypewriterEffect';
import { CSSTransition } from 'react-transition-group';

function App () {
  const [count, setCount] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <TypewriterEffect recursive={true}>
      <div className="App">
        <div>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>React TypewriterEffect</h1>
        <div className="card">
          <h2>
            Features
          </h2>
          <p>
            Support `recursive` mode to traverse all children nodes.
          </p>
          <p>
            Transitions&nbsp;
            <CSSTransition classNames="fade" timeout={400} nodeRef={buttonRef}>
              <button ref={buttonRef} onClick={() => setCount((count) => count + 1)}>
                count is {count} {true}
              </button>
            </CSSTransition>
            &nbsp;are considered.
          </p>
        </div>
        <pre className="read-the-docs">
          npm i @djagger/react-typewriter-effect
        </pre>
      </div>
    </TypewriterEffect>
  );
}

export default App;
