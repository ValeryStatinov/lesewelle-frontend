import { createRoot } from 'react-dom/client';

import { App } from './App';

export const renderApp = (shadowRoot: ShadowRoot) => {
  const reactRoot = createRoot(shadowRoot);

  reactRoot.render(<App />);
};
