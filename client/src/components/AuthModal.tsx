import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const localAuth = trpc.auth.localAuth.useMutation({
    onSuccess: () => {
      toast.success(isLogin ? "Logged in successfully" : "Signed up successfully");
      onOpenChange(false);
      // Reload to update auth state
      window.location.reload();
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur border-border/50">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2">
            <AlertCircle className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-foreground/60">
            Sign in to RAPTOR AI to access emergency services
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </Button>
        </form>

        <div className="text-center text-sm text-foreground/70">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
            type="button"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
