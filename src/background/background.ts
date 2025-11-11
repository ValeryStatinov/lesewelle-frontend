import { initialize } from './initialize/initialize';

export const runBackgroundScript = async () => {
  await initialize();
};

void runBackgroundScript();
