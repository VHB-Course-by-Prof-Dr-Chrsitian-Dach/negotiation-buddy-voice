import { useEffect } from "react";

// Lightweight wrapper for the Vapi embed widget snippet.
// Use <VapiWidget /> anywhere in your component tree (e.g., Practice page) for the canned UI.
// Requires the same environment variables as the custom voice interface.

export const VapiWidget = () => {
  useEffect(() => {
    const scriptId = "vapi-embed-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js";
      script.async = true;
      script.type = "text/javascript";
      script.id = scriptId;
      document.head.appendChild(script);
    }
  }, []);

  const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
  const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

  if (!publicKey || !assistantId) {
    return (
      <div className="p-4 border rounded-md text-sm text-red-600">
        Missing Vapi env vars (VITE_VAPI_PUBLIC_KEY / VITE_VAPI_ASSISTANT_ID).
      </div>
    );
  }

  return (
    <vapi-widget
      assistant-id={assistantId}
      public-key={publicKey}
      style={{ width: "100%", display: "block" }}
    ></vapi-widget>
  );
};
