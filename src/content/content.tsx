import { createRoot } from 'react-dom/client';

import { App } from './App';
import styles from './index.css?inline';

const runContentScript = () => {
  const div = document.createElement('div');
  const shadow = div.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = styles;
  shadow.appendChild(style);

  document.body.appendChild(div);

  const reactRoot = createRoot(shadow);
  reactRoot.render(<App />);
};

runContentScript();
