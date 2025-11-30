import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

const Leaderboard = () => {
  // Dummy leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Sarah Johnson", score: 9250, cases: 15, avgScore: 92 },
    { rank: 2, name: "Michael Chen", score: 8900, cases: 14, avgScore: 89 },
    { rank: 3, name: "Emma Williams", score: 8650, cases: 13, avgScore: 87 },
    { rank: 4, name: "James Brown", score: 8400, cases: 12, avgScore: 85 },
    { rank: 5, name: "Olivia Davis", score: 8100, cases: 11, avgScore: 82 },
    { rank: 6, name: "Noah Martinez", score: 7850, cases: 10, avgScore: 79 },
    { rank: 7, name: "Ava Garcia", score: 7600, cases: 10, avgScore: 76 },
    { rank: 8, name: "Liam Rodriguez", score: 7350, cases: 9, avgScore: 74 },
    { rank: 9, name: "Sophia Lopez", score: 7100, cases: 9, avgScore: 71 },
    { rank: 10, name: "William Lee", score: 6850, cases: 8, avgScore: 69 },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-semibold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
      case 2:
        return "from-gray-400/20 to-gray-400/5 border-gray-400/30";
      case 3:
        return "from-amber-600/20 to-amber-600/5 border-amber-600/30";
      default:
        return "from-primary/5 to-transparent border-primary/10";
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Top performers in negotiation practice. Compete with others and climb the ranks!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <Card className="p-6 text-center bg-card/50 backdrop-blur">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold">{leaderboardData.length}</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </Card>
          <Card className="p-6 text-center bg-card/50 backdrop-blur">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-3xl font-bold">156</div>
            <div className="text-sm text-muted-foreground">Total Cases Completed</div>
          </Card>
          <Card className="p-6 text-center bg-card/50 backdrop-blur">
            <Award className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold">82%</div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </Card>
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-4xl mx-auto space-y-3">
          {leaderboardData.map((user) => (
            <Card
              key={user.rank}
              className={`p-6 bg-gradient-to-r ${getRankColor(user.rank)} backdrop-blur transition-all hover:shadow-lg`}
            >
              <div className="flex items-center gap-6">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 flex items-center justify-center">
                  {getRankIcon(user.rank)}
                </div>

                {/* Name */}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.cases} cases completed
                  </p>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{user.score}</div>
                    <div className="text-xs text-muted-foreground">Total Score</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {user.avgScore}%
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">Avg Score</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Rankings updated in real-time. Complete more cases to improve your position!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
