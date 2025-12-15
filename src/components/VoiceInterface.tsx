import { useState, useEffect } from "react";
import Vapi from "@vapi-ai/web";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, PhoneOff, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { VoiceOrb } from "./VoiceOrb";
import { useNavigate } from "react-router-dom";
import type { NegotiationCase } from "@/data/negotiationCases";

// Global Vapi public key from environment variable
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY ?? "f1126e26-c62f-4452-8beb-29e341a2e639";

interface VoiceInterfaceProps {
  negotiationCase: NegotiationCase;
}

export const VoiceInterface = ({ negotiationCase }: VoiceInterfaceProps) => {
  const navigate = useNavigate();
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState<string>("Ready to start");
  const [transcript, setTranscript] = useState<Array<{role: string, text: string}>>([]);
  const { toast } = useToast();

  useEffect(() => {
    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on("call-start", () => {
      setIsConnected(true);
      setStatus("Connected");
      toast({
        title: "Connected",
        description: "Voice session started successfully",
      });
    });

    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setStatus("Call ended");
    });

    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
      setIsListening(false);
      setStatus("AI is speaking...");
    });

    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
      setStatus("Listening...");
    });

    vapiInstance.on("volume-level", (level: number) => {
      // Only show listening state when AI is not speaking
      if (!isSpeaking && isConnected) {
        if (level > 0.05) { 
          setIsListening(true);
          setStatus("You are speaking...");
        } else {
          setIsListening(false);
        }
      }
    });

    vapiInstance.on("message", (message: any) => {
      if (message.type === 'transcript') {
        setTranscript(prev => [...prev, {
          role: message.role,
          text: message.transcript
        }]);
      }
    });

    vapiInstance.on("error", (error: any) => {
      console.error("Vapi Error:", error);
      
      // Filter out non-critical errors or known noise
      if (error.message?.includes("Krisp")) return;

      toast({
        title: "Connection Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });

      // Reset state on critical errors
      setIsConnected(false);
      setStatus("Error occurred");
    });

    return () => {
      vapiInstance.stop();
    };
  }, []); 

  const startCall = async () => {
    if (!vapi) return;

    if (!negotiationCase.assistantId) {
      toast({
        title: "Configuration Error",
        description: "No assistant ID configured for this case.",
        variant: "destructive",
      });
      return;
    }

    try {
      setStatus("Connecting...");
      await vapi.start(negotiationCase.assistantId);
    } catch (error) {
      console.error("Failed to start call:", error);
      setStatus("Failed to connect");
      toast({
        title: "Connection Failed",
        description: "Could not start the voice session. Please check usage limits or microphone permissions.",
        variant: "destructive",
      });
      setIsConnected(false);
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
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
