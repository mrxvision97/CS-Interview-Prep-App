/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_DEFAULT_MODEL?: string;
  readonly VITE_DEFAULT_TEMPERATURE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
