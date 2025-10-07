import { useState, useEffect, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoiceOrb } from "./VoiceOrb";

const VAPI_PUBLIC_KEY = "f1126e26-c62f-4452-8beb-29e341a2e639";
const ASSISTANT_ID = "0f4de0f8-b0d6-4fbf-82ab-0a15fe7f3f9f";

export const VoiceInterface = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<string>("Ready to start");
  const vapiRef = useRef<Vapi | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize Vapi
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    // Set up event listeners
    vapi.on("call-start", () => {
      console.log("Call started");
      setIsConnected(true);
      setStatus("Connected");
      toast({
        title: "Connected",
        description: "Voice session started successfully",
      });
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setStatus("Call ended");
      toast({
        title: "Session Ended",
        description: "Voice session has ended",
      });
    });

    vapi.on("speech-start", () => {
      console.log("AI started speaking");
      setIsSpeaking(true);
      setIsListening(false);
      setStatus("AI is speaking...");
    });

    vapi.on("speech-end", () => {
      console.log("AI stopped speaking");
      setIsSpeaking(false);
      setStatus("Listening...");
    });

    vapi.on("volume-level", (level: number) => {
      // User is speaking if volume level is above threshold
      if (level > 0.01 && !isSpeaking) {
        setIsListening(true);
        setStatus("You are speaking...");
      } else if (level < 0.01 && !isSpeaking) {
        setIsListening(false);
        if (isConnected) {
          setStatus("Listening...");
        }
      }
    });

    vapi.on("error", (error: any) => {
      console.error("Vapi error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    });

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [toast, isSpeaking, isConnected]);

  const startCall = async () => {
    try {
      if (!vapiRef.current) return;
      
      setStatus("Connecting...");
      await vapiRef.current.start(ASSISTANT_ID);
    } catch (error: any) {
      console.error("Error starting call:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to start voice session",
        variant: "destructive",
      });
      setStatus("Failed to connect");
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      setStatus("Ready to start");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Ski Pass Negotiation
        </h1>
        <p className="text-muted-foreground text-lg">
          Practice your negotiation skills with AI
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
          <p>📍 <strong>Location:</strong> Austrian ski resort valley station</p>
          <p>🕐 <strong>Time:</strong> 12:50 PM, Thursday in January</p>
          <p>☀️ <strong>Conditions:</strong> Perfect skiing weather, fresh snow</p>
          <p>💰 <strong>Half-day pass:</strong> €30 (available from 1:00 PM)</p>
          <p>🎫 <strong>Full-day pass:</strong> €40 (being offered by another skier)</p>
        </div>
        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
          <p className="text-sm">
            <strong>Your goal:</strong> Negotiate the best price for the full-day pass. 
            The seller can't get a refund, so you have leverage. Be fair but firm!
          </p>
        </div>
      </Card>
    </div>
  );
};
