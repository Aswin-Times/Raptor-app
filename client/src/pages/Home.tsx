import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  MapPin,
  Phone,
  Zap,
  MessageCircle,
  Shield,
  Clock,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { AuthModal } from "@/components/AuthModal";
import { SosModal } from "@/components/SosModal";
import { ShieldAlert } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const createIncident = trpc.incidents.create.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const handleGetHelpNow = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    setIsLoading(true);
    try {
      const result = await createIncident.mutateAsync({
        triageLevel: "CRITICAL",
        language: "en",
      });
      setLocation(`/emergency/${result.id}`, { replace: true });
    } catch (error) {
      console.error("Failed to create incident:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    setAuthModalOpen(true);
  };

  const features = [
    {
      icon: MessageCircle,
      title: "AI Triage Assessment",
      desc: "Real-time injury assessment with CRITICAL, SERIOUS, and MINOR classifications",
    },
    {
      icon: Zap,
      title: "First Aid Guidance",
      desc: "Step-by-step emergency first aid instructions tailored to reported injuries",
    },
    {
      icon: Phone,
      title: "Dispatch Coordination",
      desc: "Instant access to emergency services with location-based contact recommendations",
    },
    {
      icon: MapPin,
      title: "Location Mapping",
      desc: "Interactive map integration for precise accident location capture and sharing",
      link: "https://www.google.com/maps/search/Nearest+Hospitals",
    },
    {
      icon: Clock,
      title: "Voice-to-Text Input",
      desc: "Hands-free emergency reporting with automatic speech transcription",
    },
    {
      icon: Shield,
      title: "Incident Logging",
      desc: "Complete chat history and incident reports saved for review and follow-up",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-primary shrink-0" />
            <span className="text-base sm:text-xl font-bold text-foreground truncate">
              RAPTOR AI
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation("/history")}
                  className="text-foreground/70 hover:text-foreground"
                >
                  History
                </Button>
                <span className="text-sm text-foreground/80 max-w-[120px] truncate">
                  {user?.name || "User"}
                </span>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={handleSignIn}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 text-foreground/70 hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border/50 bg-background/95 px-4 py-3 space-y-2">
            {isAuthenticated ? (
              <>
                <p className="text-sm text-foreground/60 truncate">{user?.name || "User"}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => { setMobileMenuOpen(false); setLocation("/history"); }}
                >
                  History
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => { setMobileMenuOpen(false); handleSignIn(); }}
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/30 bg-primary/5 mb-5 sm:mb-6">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                Real-time Emergency Response
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              Your AI Emergency{" "}
              <span className="text-primary">Co-Pilot</span>
            </h1>

            <p className="text-base sm:text-xl text-foreground/80 mb-7 sm:mb-8 leading-relaxed px-2 sm:px-0">
              RAPTOR AI guides you through road accidents with expert triage,
              real-time first aid instructions, and instant emergency dispatch
              coordination. Every second counts.
            </p>

            {/* Main Circular SOS Button */}
            <div className="flex justify-center mb-8 sm:mb-12 relative">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-3xl animate-[pulse_3s_ease-in-out_infinite]" />
              <button
                className="relative flex flex-col items-center justify-center w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 rounded-full shadow-[0_0_40px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_rgba(220,38,38,0.7)] transition-all transform hover:scale-105 active:scale-95 border-4 border-red-400/30"
                onClick={() => setSosModalOpen(true)}
              >
                <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 text-white mb-2" />
                <span className="text-white font-bold text-3xl sm:text-4xl tracking-widest">SOS</span>
                <span className="text-red-100 text-xs sm:text-sm font-medium mt-1 uppercase tracking-wider">Tap for Emergency</span>
              </button>
            </div>

            {/* AI Assistant CTA */}
            <div className="flex justify-center mb-10 sm:mb-12 px-4 sm:px-0">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary/30 text-foreground hover:bg-primary/10 font-bold text-base sm:text-lg h-12 sm:h-14 px-8 rounded-full shadow-lg"
                onClick={handleGetHelpNow}
                disabled={isLoading}
              >
                {isLoading ? "Starting..." : "Talk to AI Assistant"}
                {!isLoading && <ChevronRight className="ml-2 w-5 h-5" />}
              </Button>
            </div>

            {/* Emergency Numbers */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xs sm:max-w-md mx-auto px-4 sm:px-0">
              {[
                { num: "112", label: "Universal" },
                { num: "108", label: "Ambulance" },
                { num: "100", label: "Police" },
              ].map(({ num, label }) => (
                <a
                  key={num}
                  href={`tel:${num}`}
                  className="bg-card/50 backdrop-blur border border-border/50 hover:border-primary/50 rounded-lg p-2.5 sm:p-3 transition-all group"
                >
                  <div className="text-xl sm:text-2xl font-bold text-primary group-hover:scale-110 transition-transform">
                    {num}
                  </div>
                  <div className="text-[10px] sm:text-xs text-foreground/70">{label}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Animated bg glows */}
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/10 rounded-full blur-3xl opacity-20 -z-10 animate-pulse" />
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-32 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16 px-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              Advanced Emergency Response
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Powered by Gemma 4 AI, designed for real-world emergencies
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, title, desc, link }) => (
              <Card
                key={title}
                className={`bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all p-5 sm:p-6 group ${link ? 'cursor-pointer hover:-translate-y-1' : ''}`}
                onClick={() => link && window.open(link, "_blank")}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/30 transition-colors">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5 sm:mb-2 flex items-center gap-2">
                  {title}
                </h3>
                <p className="text-sm sm:text-base text-foreground/70">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-32 border-t border-border/50 bg-card/30">
        <div className="container text-center px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Ready to Save Lives?
          </h2>
          <p className="text-base sm:text-lg text-foreground/70 mb-7 sm:mb-8 max-w-2xl mx-auto">
            In an emergency, every second matters. RAPTOR AI is here to
            guide you through the crisis with expert AI support.
          </p>
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg h-12 sm:h-14 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
            onClick={handleGetHelpNow}
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Get Help Now"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 sm:py-8 bg-background/50">
        <div className="container text-center text-foreground/60 text-xs sm:text-sm px-4">
          <p>RAPTOR AI — AI-Powered Emergency Response System</p>
          <p className="mt-1 sm:mt-2">Always call 112 in life-threatening emergencies</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      
      {/* SOS Modal */}
      <SosModal open={sosModalOpen} onOpenChange={setSosModalOpen} />
    </div>
  );
}
