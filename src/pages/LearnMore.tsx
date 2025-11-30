import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, Brain, MessageSquare, TrendingUp, Award, Play } from "lucide-react";

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About NegotiationBuddy
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            An AI-powered platform designed to help you master the art of negotiation through realistic, voice-based practice scenarios.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* What is it */}
          <Card className="p-8 bg-card/50 backdrop-blur">
            <h2 className="text-2xl font-bold mb-4">What is NegotiationBuddy?</h2>
            <p className="text-muted-foreground leading-relaxed">
              NegotiationBuddy is a cutting-edge training platform that uses advanced AI to simulate real-world negotiation scenarios. 
              Through natural voice conversations, you can practice various negotiation situations in a risk-free environment, 
              receive instant feedback, and develop the skills needed to succeed in professional negotiations.
            </p>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Natural Voice AI</h3>
              <p className="text-muted-foreground text-sm">
                Practice with AI that speaks and responds naturally, creating realistic conversation flows just like real negotiations.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Diverse Scenarios</h3>
              <p className="text-muted-foreground text-sm">
                From simple transactions to complex business deals, practice scenarios that match real-world situations you'll encounter.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intelligent Feedback</h3>
              <p className="text-muted-foreground text-sm">
                Get detailed analysis of your performance, including tactics used, areas for improvement, and personalized recommendations.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground text-sm">
                Monitor your improvement over time with detailed metrics and compete with others on the leaderboard.
              </p>
            </Card>
          </div>

          {/* How it Works */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" />
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Choose a Scenario</h4>
                  <p className="text-sm text-muted-foreground">
                    Select from various negotiation cases based on difficulty and topic.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Start the Conversation</h4>
                  <p className="text-sm text-muted-foreground">
                    Use your voice to negotiate with the AI in real-time, just like a phone call.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Receive Feedback</h4>
                  <p className="text-sm text-muted-foreground">
                    After the session, review your performance, score, and actionable insights for improvement.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center pt-8">
            <Button
              size="lg"
              onClick={() => navigate("/cases")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Practicing Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;
