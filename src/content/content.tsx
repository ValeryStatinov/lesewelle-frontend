import { renderApp } from './App/renderApp';
import { registerMessageListeners } from './initialize/registerMessageListeners';
import { addStylesToShadowRoot, createShadowRoot } from './initialize/shadowRoot';
import { initAppState } from './state/appState';
import styles from './index.css?inline';

const runContentScript = async () => {
  const { shadowRoot, widgetContainer } = createShadowRoot();
  addStylesToShadowRoot(styles);
  await initAppState();

  document.body.appendChild(widgetContainer);

  renderApp(shadowRoot);
  registerMessageListeners();
};

void runContentScript();
