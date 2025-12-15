import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, PhoneOff, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoiceOrb } from "./VoiceOrb";
import { useNavigate } from "react-router-dom";
import type { NegotiationCase } from "@/data/negotiationCases";

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY as string | undefined;

// Extend Window interface for vapiSDK
declare global {
  interface Window {
    vapiSDK?: {
      run: (config: {
        apiKey: string;
        assistant: string;
        config?: Record<string, unknown>;
      }) => VapiInstance;
    };
    vapiInstance?: VapiInstance;
  }
}

interface VapiInstance {
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  start: () => void;
  stop: () => void;
}

interface VoiceInterfaceProps {
  negotiationCase: NegotiationCase;
}

export const VoiceInterface = ({ negotiationCase }: VoiceInterfaceProps) => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<string>("Ready to start");
  const [isConnecting, setIsConnecting] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const vapiInstanceRef = useRef<VapiInstance | null>(null);
  const { toast } = useToast();

  // Load Vapi SDK via script tag (official recommended approach)
  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) {
      setStatus("Missing API configuration");
      return;
    }

    const scriptId = "vapi-sdk-script";
    
    // Check if script already loaded
    if (document.getElementById(scriptId)) {
      if (window.vapiSDK) {
        setSdkLoaded(true);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.defer = true;
    script.async = true;

    script.onload = () => {
      console.log("[Vapi] SDK loaded via CDN");
      setSdkLoaded(true);
    };

    script.onerror = () => {
      console.error("[Vapi] Failed to load SDK");
      setStatus("Failed to load voice SDK");
      toast({
        title: "SDK Error",
        description: "Failed to load voice SDK. Please refresh the page.",
        variant: "destructive",
      });
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup: stop any active call
      if (vapiInstanceRef.current) {
        try {
          vapiInstanceRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [toast]);

  // Initialize Vapi instance when SDK is loaded and assistant changes
  useEffect(() => {
    if (!sdkLoaded || !window.vapiSDK || !VAPI_PUBLIC_KEY || !negotiationCase.assistantId) {
      return;
    }

    console.log("[Vapi] Initializing with assistant:", negotiationCase.assistantId);

    try {
      const instance = window.vapiSDK.run({
        apiKey: VAPI_PUBLIC_KEY,
        assistant: negotiationCase.assistantId,
        config: {
          hide: true, // Hide the default button, we use our own UI
          position: "bottom-right",
        },
      });

      vapiInstanceRef.current = instance;

      instance.on("call-start", () => {
        console.log("[Vapi] Call started");
        setIsConnected(true);
        setIsConnecting(false);
        setStatus("Connected - Start speaking!");
        toast({ title: "Connected", description: "Voice session started" });
      });

      instance.on("call-end", () => {
        console.log("[Vapi] Call ended");
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
        setIsListening(false);
        setStatus("Session ended");
      });

      instance.on("speech-start", () => {
        setIsSpeaking(true);
        setIsListening(false);
        setStatus("AI is speaking...");
      });

      instance.on("speech-end", () => {
        setIsSpeaking(false);
        setStatus("Listening...");
      });

      instance.on("volume-level", (level: unknown) => {
        const vol = level as number;
        if (!isSpeaking && isConnected) {
          setIsListening(vol > 0.01);
          if (vol > 0.01) {
            setStatus("You are speaking...");
          }
        }
      });

      instance.on("message", (message: unknown) => {
        console.log("[Vapi] Message:", message);
      });

      instance.on("error", (error: unknown) => {
        console.error("[Vapi] Error:", error);
        const err = error as { message?: string };
        const errorMsg = err?.message || "";

        // Ignore Krisp-related errors
        if (errorMsg.includes("Krisp") || errorMsg.includes("processor")) {
          console.log("[Vapi] Ignoring Krisp processor error");
          return;
        }

        setIsConnecting(false);
        toast({
          title: "Connection Error",
          description: errorMsg || "Failed to connect. Please try again.",
          variant: "destructive",
        });
        setStatus("Error - try again");
      });

      setStatus("Ready to start");
    } catch (error) {
      console.error("[Vapi] Failed to initialize:", error);
      setStatus("Failed to initialize");
    }

    return () => {
      if (vapiInstanceRef.current) {
        try {
          vapiInstanceRef.current.stop();
        } catch (e) {
          // Ignore cleanup errors
        }
        vapiInstanceRef.current = null;
      }
    };
  }, [sdkLoaded, negotiationCase.assistantId, toast, isSpeaking, isConnected]);

  const startCall = useCallback(async () => {
    if (!vapiInstanceRef.current) {
      toast({
        title: "Not Ready",
        description: "Voice SDK is still loading. Please wait.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      setIsConnecting(true);
      setStatus("Connecting...");

      console.log("[Vapi] Starting call...");
      vapiInstanceRef.current.start();
    } catch (error) {
      console.error("[Vapi] Start call error:", error);
      setIsConnecting(false);
      setStatus("Failed to connect");

      const err = error as { name?: string; message?: string };
      if (err.name === "NotAllowedError") {
        toast({
          title: "Microphone Required",
          description: "Please allow microphone access to use voice practice",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: err?.message || "Unable to start voice session",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const endCall = useCallback(() => {
    if (vapiInstanceRef.current) {
      vapiInstanceRef.current.stop();
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
      setIsListening(false);
      setStatus("Ready to start");
    }
  }, []);

  if (!VAPI_PUBLIC_KEY) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 text-center">
        <Card className="p-6 bg-destructive/10 border-destructive/20">
          <h2 className="text-xl font-semibold text-destructive mb-2">Configuration Required</h2>
          <p className="text-muted-foreground">
            Please set <code className="bg-muted px-2 py-1 rounded">VITE_VAPI_PUBLIC_KEY</code> environment variable.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {negotiationCase.title}
        </h1>
        <p className="text-muted-foreground text-lg">
          {negotiationCase.description}
        </p>
      </div>

      {/* Voice Orb */}
      <VoiceOrb
        isConnected={isConnected}
        isSpeaking={isSpeaking}
        isListening={isListening}
      />

      {/* Status */}
      <div className="text-center">
        <p className="text-lg text-foreground/80">{status}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isConnected ? (
          <Button
            size="lg"
            onClick={startCall}
            disabled={isConnecting || !sdkLoaded}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Phone className="mr-2 h-5 w-5" />
            {!sdkLoaded ? "Loading..." : isConnecting ? "Connecting..." : "Start Practice"}
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={endCall}
            variant="destructive"
            className="rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <PhoneOff className="mr-2 h-5 w-5" />
            End Session
          </Button>
        )}
      </div>

      {/* Info Card */}
      <Card className="p-6 w-full max-w-2xl bg-card/50 backdrop-blur">
        <h3 className="text-xl font-semibold mb-4">Scenario Overview</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>📍 <strong>Location:</strong> {negotiationCase.scenario.location}</p>
          <p>🕐 <strong>Time:</strong> {negotiationCase.scenario.time}</p>
          <p>☀️ <strong>Conditions:</strong> {negotiationCase.scenario.conditions}</p>
          <p>👤 <strong>Your Role:</strong> {negotiationCase.scenario.yourRole}</p>
          <p>🤖 <strong>AI Role:</strong> {negotiationCase.scenario.aiRole}</p>
        </div>
        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
          <p className="text-sm">
            <strong>Your Objective:</strong> {negotiationCase.scenario.objective}
          </p>
        </div>
      </Card>

      {/* Learn More Button */}
      <Button
        variant="outline"
        onClick={() => navigate("/learn-more")}
        className="rounded-full px-6"
      >
        <BookOpen className="mr-2 h-4 w-4" />
        Learn More About Negotiation
      </Button>
    </div>
  );
};
