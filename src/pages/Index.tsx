import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Mic, Target, TrendingUp, Award } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Mic className="w-4 h-4" />
              Voice-Powered AI Training
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Master Negotiation
              </span>
              <br />
              <span className="text-foreground">Through AI Practice</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Practice real-world negotiation scenarios with our advanced AI voice assistant. 
              Get instant feedback and improve your skills.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/practice")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Practicing
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg border-primary/20 hover:bg-primary/5"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 bg-card/50 backdrop-blur border-primary/10 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Realistic Scenarios</h3>
            <p className="text-muted-foreground">
              Practice with AI that responds naturally to your negotiation tactics and strategies.
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-primary/10 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
            <p className="text-muted-foreground">
              Receive detailed performance analysis and grade after each practice session.
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur border-primary/10 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Skill Development</h3>
            <p className="text-muted-foreground">
              Track your progress and improve your negotiation skills over time.
            </p>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Improve Your Skills?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your first practice session now and see immediate results.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/practice")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Mic className="mr-2 h-5 w-5" />
            Begin Practice Session
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Index;
