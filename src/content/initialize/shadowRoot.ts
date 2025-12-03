export let widgetContainer: HTMLDivElement;
export let shadowRoot: ShadowRoot;

export const LESEWELLE_WIDGET_ID = 'lesewelle-widget';

export const checkIfWidgetExists = () => {
  const widgetContainer = document.getElementById(LESEWELLE_WIDGET_ID);

  return !!widgetContainer;
};

export const createShadowRoot = () => {
  const div = document.createElement('div');
  div.id = LESEWELLE_WIDGET_ID;
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
