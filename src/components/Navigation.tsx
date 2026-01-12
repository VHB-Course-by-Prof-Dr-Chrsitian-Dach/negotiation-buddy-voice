import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Trophy, BookOpen } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const onLogout = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              NegotiationBuddy
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            
            <Link to="/leaderboard">
              <Button
                variant={isActive("/leaderboard") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Trophy className="h-4 w-4" />
                Leaderboard
              </Button>
            </Link>
            
            <Link to="/learn-more">
              <Button
                variant={isActive("/learn-more") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Learn More
              </Button>
            </Link>

            {!isLoading && !user && (
              <Link to="/login">
                <Button size="sm" className="ml-2">
                  Login
                </Button>
              </Link>
            )}

            {!isLoading && user && (
              <Button size="sm" variant="outline" className="ml-2" onClick={onLogout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
