import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, PhoneOff, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoiceOrb } from "./VoiceOrb";
import { useNavigate } from "react-router-dom";
import type { NegotiationCase } from "@/data/negotiationCases";

// Base public key fallback if a case does not specify one
const GLOBAL_VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY as string | undefined;

interface VoiceInterfaceProps {
  negotiationCase: NegotiationCase;
}

export const VoiceInterface = ({ negotiationCase }: VoiceInterfaceProps) => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<string>("Ready to start");
  const vapiRef = useRef<Vapi | null>(null);
  const speakingRef = useRef(false);
  const connectedRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    const effectivePublicKey = negotiationCase.publicKey || GLOBAL_VAPI_PUBLIC_KEY;
    console.log("[VoiceInterface] Initializing Vapi for case:", negotiationCase.id);
    console.log("[VoiceInterface] Public key:", effectivePublicKey);
    console.log("[VoiceInterface] Assistant ID:", negotiationCase.assistantId || "none (will use transient)");
    
    if (!effectivePublicKey) {
      setStatus("Missing Vapi configuration");
      toast({
        title: "Configuration Missing",
        description: "Set VITE_VAPI_PUBLIC_KEY in .env.local or provide publicKey per case",
        variant: "destructive",
      });
      return;
    }

    // Clean up previous instance if it exists
    if (vapiRef.current) {
      console.log("[VoiceInterface] Cleaning up previous Vapi instance");
      try {
        vapiRef.current.stop();
      } catch (e) {
        console.warn("[VoiceInterface] Error stopping previous instance:", e);
      }
    }

    // Initialize Vapi with configuration to disable Krisp
    console.log("[VoiceInterface] Creating new Vapi instance");
    const vapi = new Vapi(effectivePublicKey, {
      // Disable Krisp noise cancellation to prevent processor errors
      enableKrisp: false,
    });
    vapiRef.current = vapi;

    // Set up event listeners
    vapi.on("call-start", () => {
      console.log("Call started");
      connectedRef.current = true;
      setIsConnected(true);
      setStatus("Connected");
      toast({
        title: "Connected",
        description: "Voice session started successfully",
      });
    });

    vapi.on("call-end", (endEvent: any) => {
      console.log("Call ended", endEvent);
      console.log("Call end reason:", endEvent?.reason || "unknown");
      connectedRef.current = false;
      speakingRef.current = false;
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setStatus("Call ended");
      
      // Only show toast if call wasn't manually ended by user
      if (endEvent?.reason !== "user-ended") {
        toast({
          title: "Session Ended",
          description: endEvent?.reason ? `Reason: ${endEvent.reason}` : "Voice session has ended",
        });
      }
    });

    vapi.on("speech-start", () => {
      console.log("AI started speaking");
      speakingRef.current = true;
      setIsSpeaking(true);
      setIsListening(false);
      setStatus("AI is speaking...");
    });

    vapi.on("speech-end", () => {
      console.log("AI stopped speaking");
      speakingRef.current = false;
      setIsSpeaking(false);
      setStatus("Listening...");
    });

    vapi.on("volume-level", (level: number) => {
      // Only update listening state when AI isn't speaking
      if (!speakingRef.current) {
        if (level > 0.01) {
          setIsListening(true);
          setStatus("You are speaking...");
        } else {
          setIsListening(false);
          if (connectedRef.current) setStatus("Listening...");
        }
      }
    });

    vapi.on("error", (error: any) => {
      console.error("[Vapi Error] Full error object:", error);
      console.error("[Vapi Error] Type:", error?.type);
      console.error("[Vapi Error] Message:", error?.message);
      console.error("[Vapi Error] Details:", error?.details);
      console.error("[Vapi Error] Stage:", error?.stage);
      console.error("[Vapi Error] Stringified:", JSON.stringify(error, null, 2));
      
      let errorMsg = "An error occurred";
      if (error.message) {
        errorMsg = error.message;
      }
      
      // Check for common errors
      if (error.type === "start-method-error") {
        errorMsg = "Failed to start call. The assistant ID may be invalid or inaccessible.";
        setStatus("Failed to connect");
      } else if (error.type === "validation-error") {
        errorMsg = "Configuration validation failed. Check assistant settings.";
        setStatus("Failed to connect");
      } else if (error.message?.includes("assistant") || error.message?.includes("404")) {
        errorMsg = "Assistant not found. Please verify your assistant ID in the Vapi dashboard.";
        setStatus("Failed to connect");
      } else if (error.message?.includes("microphone") || error.message?.includes("audio")) {
        errorMsg = "Microphone error. Please check your audio settings.";
      } else if (error.message?.includes("Krisp") || error.message?.includes("processor")) {
        // Krisp errors are non-fatal, just log them
        console.warn("[Vapi] Krisp processor warning (non-fatal):", error.message);
        return; // Don't show toast for Krisp warnings
      }
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    });

    vapi.on("message", (message: any) => {
      console.log("Vapi message:", message);
    });

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  // Only run once (toast is stable enough, but suppress lint if needed)
  }, [toast, negotiationCase.publicKey]);

  const startCall = async () => {
    try {
      if (!vapiRef.current) return;
      
      // Check microphone permissions first
      setStatus("Requesting microphone access...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      } catch (permError: any) {
        console.error("Microphone permission error:", permError);
        toast({
          title: "Microphone Access Required",
          description: "Please allow microphone access to start the practice session",
          variant: "destructive",
        });
        setStatus("Microphone access denied");
        return;
      }
      
      setStatus("Connecting...");
      console.log("[startCall] Initiating call");
      console.log("[startCall] Case:", negotiationCase.title);
      console.log("[startCall] Case ID:", negotiationCase.id);
      const effectivePublicKey = negotiationCase.publicKey || GLOBAL_VAPI_PUBLIC_KEY;
      console.log("[startCall] Public key:", effectivePublicKey);
      console.log("[startCall] Assistant ID:", negotiationCase.assistantId || "(none - will use transient)");
      console.log("[startCall] Vapi instance exists:", !!vapiRef.current);
      
      try {
        // Decide between existing assistant (by ID) or transient inline assistant
        if (negotiationCase.assistantId) {
          console.log("[startCall] Using hosted assistant with ID:", negotiationCase.assistantId);
          console.log("[startCall] Calling vapi.start() with assistant ID...");
          await vapiRef.current.start(negotiationCase.assistantId);
          console.log("[startCall] vapi.start() completed successfully");
        } else {
          console.log("No assistantId on case; creating transient assistant inline");
          // Transient assistant must be nested under 'assistant'
          const transientConfig = {
            assistant: {
              name: negotiationCase.title,
              firstMessage: negotiationCase.firstMessage,
              model: {
                provider: "openai",
                model: "gpt-4",
                messages: [
                  {
                    role: "system",
                    content: negotiationCase.systemPrompt,
                  },
                ],
                temperature: 0.7,
              },
              voice: {
                provider: "11labs", // Adjust if provider requires different identifier (e.g. 'elevenlabs')
                voiceId: "21m00Tcm4TlvDq8ikWAM",
              },
              transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "en",
              },
              recordingEnabled: false,
            },
          } as const;
          console.log("Transient assistant payload:", transientConfig);
          await vapiRef.current.start(undefined, transientConfig);
        }
        console.log("Call start initiated successfully");
      } catch (startError: any) {
        console.error("Start call error:", startError);
        console.error("Full error object:", JSON.stringify(startError, null, 2));
        let errorMessage = "Failed to start call";
        
        if (startError?.message) {
          errorMessage = startError.message;
        } else if (startError?.type === "validation-error") {
          errorMessage = "Validation error: ensure transient assistant is wrapped in { assistant: { ... } } or provide ASSISTANT_ID.";
        }
        
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error starting call:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to start voice session. Please check your Vapi assistant configuration.",
        variant: "destructive",
      });
      setStatus("Failed to connect");
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      console.log("User manually ending call");
      vapiRef.current.stop();
      // Reset state immediately
      connectedRef.current = false;
      speakingRef.current = false;
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setStatus("Ready to start");
    }
  };

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
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Phone className="mr-2 h-5 w-5" />
            Start Practice
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
