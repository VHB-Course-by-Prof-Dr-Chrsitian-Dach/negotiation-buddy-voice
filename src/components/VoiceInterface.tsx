import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, PhoneOff, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoiceOrb } from "./VoiceOrb";
import { useNavigate } from "react-router-dom";
import type { NegotiationCase } from "@/data/negotiationCases";

// Global Vapi public key from environment variable
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY as string | undefined;

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
  const isMountedRef = useRef(true);
  const { toast } = useToast();

  useEffect(() => {
    isMountedRef.current = true;
    
    if (!VAPI_PUBLIC_KEY || typeof VAPI_PUBLIC_KEY !== 'string') {
      setStatus("Missing Vapi configuration");
      toast({
        title: "Configuration Missing",
        description: "Set VITE_VAPI_PUBLIC_KEY in .env.local",
        variant: "destructive",
      });
      return;
    }

    // Initialize Vapi once - only create new instance if it doesn't exist
    if (!vapiRef.current) {
      const vapi = new Vapi(VAPI_PUBLIC_KEY, {
        enableKrisp: false,
      });
      vapiRef.current = vapi;

      // Set up event listeners
      vapi.on("call-start", () => {
        if (!isMountedRef.current) return;
        connectedRef.current = true;
        setIsConnected(true);
        setStatus("Connected");
        toast({
          title: "Connected",
          description: "Voice session started successfully",
        });
      });

      vapi.on("call-end", (endEvent: unknown) => {
        if (!isMountedRef.current) return;
        connectedRef.current = false;
        speakingRef.current = false;
        setIsConnected(false);
        setIsSpeaking(false);
        setIsListening(false);
        setStatus("Call ended");
        
        const event = endEvent as { reason?: string };
        if (event?.reason !== "user-ended") {
          toast({
            title: "Session Ended",
            description: event?.reason ? `Reason: ${event.reason}` : "Voice session has ended",
          });
        }
      });

      vapi.on("speech-start", () => {
        if (!isMountedRef.current) return;
        speakingRef.current = true;
        setIsSpeaking(true);
        setIsListening(false);
        setStatus("AI is speaking...");
      });

      vapi.on("speech-end", () => {
        if (!isMountedRef.current) return;
        speakingRef.current = false;
        setIsSpeaking(false);
        setStatus("Listening...");
      });

      vapi.on("volume-level", (level: number) => {
        if (!isMountedRef.current) return;
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

      vapi.on("error", (error: unknown) => {
        if (!isMountedRef.current) return;
        
        const err = error as { type?: string; message?: string };
        let errorMsg = "An error occurred";
        if (err.message) {
          errorMsg = err.message;
        }
        
        if (err.type === "start-method-error") {
          errorMsg = "Failed to start call. The assistant ID may be invalid or inaccessible.";
          setStatus("Failed to connect");
        } else if (err.type === "validation-error") {
          errorMsg = "Configuration validation failed. Check assistant settings.";
          setStatus("Failed to connect");
        } else if (err.message?.includes("assistant") || err.message?.includes("404")) {
          errorMsg = "Assistant not found. Please verify your assistant ID in the Vapi dashboard.";
          setStatus("Failed to connect");
        } else if (err.message?.includes("microphone") || err.message?.includes("audio")) {
          errorMsg = "Microphone error. Please check your audio settings.";
        } else if (err.message?.includes("Krisp") || err.message?.includes("processor")) {
          return;
        }
        
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      });
    }

    return () => {
      isMountedRef.current = false;
      if (vapiRef.current) {
        vapiRef.current.stop();
        vapiRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCall = async () => {
    if (!vapiRef.current || !negotiationCase.assistantId) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      setStatus("Connecting...");
      await vapiRef.current.start(negotiationCase.assistantId);
    } catch (error) {
      setStatus("Failed to connect");
      toast({
        title: "Connection Failed",
        description: "Please check your microphone and try again",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
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
