import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

type Step = "email" | "reset";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading, isConfigured } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/cases", { replace: true });
    }
  }, [isLoading, user, navigate]);

  const sendCode = async (e: React.FormEvent) => {
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
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
      );
      if (resetError) throw resetError;

      toast({
        title: "Verification code sent",
        description: "Check your inbox for a 6-digit code.",
      });
      setStep("reset");
    } catch (err: unknown) {
      toast({
        title: "Could not send code",
        description: getErrorMessage(err, "Please try again."),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", description: "Please re-enter the same password.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: "recovery",
      });
      if (verifyError) throw verifyError;
      if (!data.session) throw new Error("Verification succeeded but no session was created.");

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      await supabase.auth.signOut();

      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      navigate("/login", { replace: true });
    } catch (err: unknown) {
      toast({
        title: "Could not reset password",
        description: getErrorMessage(err, "Please try again."),
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
                    Reset password
                  </span>
                </h1>
                <p className="text-muted-foreground">Login with student email</p>
              </div>

              {!isConfigured && (
                <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  Auth is not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
                </div>
              )}

              {step === "email" && (
                <form className="space-y-4" onSubmit={sendCode}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Student Email</Label>
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

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={submitting || isLoading}
                  >
                    {submitting ? "Sending..." : "Send reset code"}
                  </Button>

                  <div className="text-sm text-center">
                    <Link to="/login" className="text-primary hover:underline">
                      Back to login
                    </Link>
                  </div>
                </form>
              )}

              {step === "reset" && (
                <form className="space-y-4" onSubmit={resetPassword}>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Enter the code sent to <span className="font-medium text-foreground">{email}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      inputMode="numeric"
                      placeholder="Enter code from email"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={submitting}
                  >
                    {submitting ? "Updating..." : "Update password"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStep("email");
                      setCode("");
                      setPassword("");
                      setConfirmPassword("");
                    }}
                    disabled={submitting}
                  >
                    Start over
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
