import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { negotiationCases } from "@/data/negotiationCases";
import { Play, Clock, BarChart3 } from "lucide-react";

const CaseSelection = () => {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Choose Your Scenario
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select a negotiation case to practice. Each scenario is designed to develop specific skills.
          </p>
        </div>

        {/* Cases Grid */}
        <div className="max-w-5xl mx-auto space-y-6">
          {negotiationCases.map((negotiationCase, index) => (
            <Card
              key={negotiationCase.id}
              className="p-6 bg-card/50 backdrop-blur border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer group"
              onClick={() => navigate(`/practice/${negotiationCase.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Case Number */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                </div>

                {/* Case Info */}
                <div className="flex-grow space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                      {negotiationCase.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(negotiationCase.difficulty)}
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      {negotiationCase.difficulty}
                    </Badge>
                    <Badge variant="outline" className="border-primary/20">
                      <Clock className="w-3 h-3 mr-1" />
                      {negotiationCase.duration}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground">
                    {negotiationCase.description}
                  </p>

                  {/* Scenario Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm pt-2">
                    <div>
                      <span className="font-medium">Your Role:</span>{" "}
                      <span className="text-muted-foreground">{negotiationCase.scenario.yourRole}</span>
                    </div>
                    <div>
                      <span className="font-medium">Location:</span>{" "}
                      <span className="text-muted-foreground">{negotiationCase.scenario.location}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full group-hover:shadow-lg transition-all"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Start
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Coming Soon Card */}
        <Card className="p-8 text-center bg-card/30 backdrop-blur border-dashed border-primary/20 mt-6 max-w-5xl mx-auto">
          <p className="text-muted-foreground text-lg">
            More negotiation scenarios coming soon...
          </p>
        </Card>
      </div>
    </div>
  );
};

export default CaseSelection;
