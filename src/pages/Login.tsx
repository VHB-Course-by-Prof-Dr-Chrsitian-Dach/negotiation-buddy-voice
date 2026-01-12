import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/auth/AuthContext";
import { studentEmailError } from "@/auth/studentEmail";
import { getErrorMessage } from "@/lib/errors";

type LocationState = { from?: string };

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isLoading, isConfigured } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/cases", { replace: true });
    }
  }, [isLoading, user, navigate]);

  const from = (location.state as LocationState | null)?.from;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = studentEmailError(email);
    if (error) {
      toast({ title: "Student Email Required", description: error, variant: "destructive" });
      return;
    }

    if (!isConfigured) {
      toast({
        title: "Auth not configured",
        description: "Missing Supabase environment variables.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (signInError) throw signInError;

      navigate(from ?? "/cases", { replace: true });
    } catch (err: unknown) {
      toast({
        title: "Login failed",
        description: getErrorMessage(err, "Could not sign in."),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <Navigation />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />

        <div className="relative container mx-auto px-4 pt-28 pb-16">
          <div className="max-w-md mx-auto">
            <Card className="p-8 bg-card/60 backdrop-blur border-primary/10">
              <div className="space-y-2 mb-6 text-center">
                <h1 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Welcome back
                  </span>
                </h1>
                <p className="text-muted-foreground">Login with student email</p>
              </div>

              {!isConfigured && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  Auth is not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
                </div>
              )}

              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="login with student email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={submitting || isLoading}
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    Forgot password?
                  </Link>
                  <Link to="/register" className="text-primary hover:underline">
                    Create account
                  </Link>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
