import { renderApp } from './App/renderApp';
import { registerMessageListeners } from './initialize/registerMessageListeners';
import { addStylesToShadowRoot, createShadowRoot } from './initialize/shadowRoot';
import styles from './index.css?inline';

const runContentScript = () => {
  const { shadowRoot, widgetContainer } = createShadowRoot();
  addStylesToShadowRoot(styles);

  document.body.appendChild(widgetContainer);

  renderApp(shadowRoot);
  registerMessageListeners();
};

runContentScript();
