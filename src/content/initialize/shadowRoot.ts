export let widgetContainer: HTMLDivElement;
export let shadowRoot: ShadowRoot;

export const createShadowRoot = () => {
  const div = document.createElement('div');
  const shadow = div.attachShadow({ mode: 'open' });

  widgetContainer = div;
  shadowRoot = shadow;

  return {
    widgetContainer,
    shadowRoot: shadow,
  };
};

export const addStylesToShadowRoot = (styles: string) => {
  const style = document.createElement('style');
  style.textContent = styles;
  shadowRoot.appendChild(style);
};
