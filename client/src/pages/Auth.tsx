import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const localAuth = trpc.auth.localAuth.useMutation({
    onSuccess: () => {
      toast.success(isLogin ? "Logged in successfully" : "Signed up successfully");
      setLocation("/");
    },
    onError: (error) => {
      toast.error(error.message || "Authentication failed");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsLoading(true);
    try {
      await localAuth.mutateAsync({
        name: isLogin ? undefined : name,
        email,
        password,
        action: isLogin ? "login" : "signup"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card flex flex-col p-4">
      <div className="container max-w-md mx-auto pt-8 flex-1 flex flex-col justify-center">
        <Button 
          variant="ghost" 
          className="self-start mb-6 -ml-4 text-foreground/70"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="p-6 sm:p-8 border-border/50 bg-card/50 backdrop-blur">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-foreground/60 mt-2">
              Sign in to RAPTOR AI to access emergency services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-input/50"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <Input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input/50"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-foreground/70">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline font-medium"
              type="button"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
