/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VAPI_PUBLIC_KEY: string
  readonly VITE_VAPI_ASSISTANT_ID_GATEKEEPER: string
  readonly VITE_VAPI_ASSISTANT_ID_SKIPASS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
