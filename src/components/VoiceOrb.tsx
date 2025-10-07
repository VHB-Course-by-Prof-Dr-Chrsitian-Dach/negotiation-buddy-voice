import { cn } from "@/lib/utils";

interface VoiceOrbProps {
  isConnected: boolean;
  isSpeaking: boolean;
  isListening: boolean;
}

export const VoiceOrb = ({ isConnected, isSpeaking, isListening }: VoiceOrbProps) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow rings */}
      {isConnected && (
        <>
          <div
            className={cn(
              "absolute w-80 h-80 rounded-full",
              isSpeaking && "bg-accent/20 animate-speaking",
              isListening && "bg-primary/20 animate-listening",
              !isSpeaking && !isListening && "bg-primary/10 animate-pulse-glow"
            )}
            style={{
              filter: "blur(40px)",
            }}
          />
          <div
            className={cn(
              "absolute w-64 h-64 rounded-full",
              isSpeaking && "bg-accent/30 animate-speaking",
              isListening && "bg-primary/30 animate-listening",
              !isSpeaking && !isListening && "bg-primary/20 animate-pulse-glow"
            )}
            style={{
              filter: "blur(30px)",
              animationDelay: "0.2s",
            }}
          />
        </>
      )}

      {/* Main orb */}
      <div
        className={cn(
          "relative w-48 h-48 rounded-full transition-all duration-500",
          "flex items-center justify-center",
          "shadow-2xl",
          !isConnected && "bg-gradient-to-br from-secondary to-secondary/50",
          isConnected && !isSpeaking && !isListening && "bg-gradient-to-br from-primary to-primary/80",
          isListening && "bg-gradient-to-br from-primary to-primary/60 animate-listening",
          isSpeaking && "bg-gradient-to-br from-accent to-accent/60 animate-speaking"
        )}
      >
        {/* Inner light effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-0 transition-opacity duration-500",
            isConnected && "opacity-100",
            "bg-gradient-radial from-white/20 to-transparent"
          )}
        />

        {/* Center icon/indicator */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {!isConnected && (
            <div className="text-muted-foreground text-sm">Not Connected</div>
          )}
          {isConnected && !isSpeaking && !isListening && (
            <div className="w-4 h-4 bg-foreground/60 rounded-full animate-pulse" />
          )}
          {isListening && (
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-8 bg-foreground rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}
          {isSpeaking && (
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-foreground rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 32 + 16}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "0.6s",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
