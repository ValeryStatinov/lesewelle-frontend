import { renderApp } from './App/renderApp';
import { registerMessageListeners } from './initialize/registerMessageListeners';
import { addStylesToShadowRoot, createShadowRoot } from './initialize/shadowRoot';
import { initState } from './state/initState';
import styles from './index.css?inline';

const runContentScript = async () => {
  const { shadowRoot, widgetContainer } = createShadowRoot();
  addStylesToShadowRoot(styles);
  await initState();

  document.body.appendChild(widgetContainer);

  renderApp(shadowRoot);
  registerMessageListeners();
};

void runContentScript();
