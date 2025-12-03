interface ImportMetaEnv {
  readonly VITE_AMPLITUDE_API_KEY: string;
  readonly VITE_BACKEND_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
