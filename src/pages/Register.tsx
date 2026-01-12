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

type Step = "email" | "code" | "password";

const Register = () => {
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
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
        },
      });
      if (otpError) throw otpError;

      toast({
        title: "Verification code sent",
        description: "Check your inbox for a 6-digit code.",
      });
      setStep("code");
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

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast({ title: "Enter the code", description: "Please enter the 6-digit code.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: "email",
      });
      if (error) throw error;

      if (!data.session) {
        throw new Error("Verification succeeded but no session was created.");
      }

      toast({ title: "Email verified", description: "Now set a password to finish." });
      setStep("password");
    } catch (err: unknown) {
      toast({
        title: "Invalid code",
        description: getErrorMessage(err, "Please try again."),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const setNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please re-enter the same password.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast({ title: "Account created", description: "You can now start practicing." });
      navigate("/cases", { replace: true });
    } catch (err: unknown) {
      toast({
        title: "Could not set password",
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
                    Create account
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
                    {submitting ? "Sending..." : "Send verification code"}
                  </Button>

                  <div className="text-sm text-center">
                    <Link to="/login" className="text-primary hover:underline">
                      Already have an account? Sign in
                    </Link>
                  </div>
                </form>
              )}

              {step === "code" && (
                <form className="space-y-4" onSubmit={verifyCode}>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      We sent a verification code to <span className="font-medium text-foreground">{email}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      inputMode="numeric"
                      placeholder="6-digit code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={submitting}
                  >
                    {submitting ? "Verifying..." : "Verify code"}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setStep("email");
                      setCode("");
                    }}
                    disabled={submitting}
                  >
                    Change email
                  </Button>
                </form>
              )}

              {step === "password" && (
                <form className="space-y-4" onSubmit={setNewPassword}>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email verified. Set a password to finish.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
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
                    {submitting ? "Saving..." : "Finish"}
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

export default Register;
