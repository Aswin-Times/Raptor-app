import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Clock, MapPin, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ChatHistory() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const { data: incidents, isLoading } = trpc.incidents.listUserIncidents.useQuery();

  const handleResumeIncident = (incidentId: number) => {
    setLocation(`/emergency/${incidentId}`, { replace: true });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="bg-card p-6 sm:p-8 text-center max-w-sm w-full">
          <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Authentication Required
          </h2>
          <p className="text-foreground/70 mb-6">
            Please sign in to view your incident history
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="bg-primary text-primary-foreground w-full"
          >
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      {/* Header */}
      <div className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-40 bg-background/80">
        <div className="container h-14 sm:h-16 flex items-center gap-2">
          <button
            onClick={() => setLocation("/")}
            className="p-1.5 text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Back to home"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
          <h1 className="font-bold text-foreground text-base sm:text-lg truncate">
            Emergency Chat History
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 sm:py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm text-foreground/60">Loading incidents...</p>
            </div>
          </div>
        ) : !incidents || incidents.length === 0 ? (
          <Card className="bg-card/50 border-border/50 p-8 sm:p-12 text-center max-w-md mx-auto">
            <Clock className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              No Incident History
            </h2>
            <p className="text-sm sm:text-base text-foreground/70 mb-6">
              Your emergency chat sessions will appear here for future reference.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-primary text-primary-foreground w-full sm:w-auto"
            >
              Return to Home
            </Button>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
            <p className="text-sm text-foreground/50 mb-2">
              {incidents.length} incident{incidents.length !== 1 ? "s" : ""} found
            </p>
            {incidents.map((incident) => {
              const triageBadge =
                incident.triageLevel === "CRITICAL"
                  ? "bg-primary/20 text-primary"
                  : incident.triageLevel === "SERIOUS"
                  ? "bg-secondary/20 text-secondary"
                  : "bg-green-500/20 text-green-400";

              return (
                <Card
                  key={incident.id}
                  className="bg-card/50 border-border/50 hover:border-primary/50 transition-all p-4 sm:p-6 cursor-pointer group"
                  onClick={() => handleResumeIncident(incident.id)}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-foreground">
                        Incident #{incident.id}
                      </h3>
                      <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
                        {new Date(incident.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded shrink-0 ${triageBadge}`}
                    >
                      {incident.triageLevel}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {incident.location && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-foreground/70">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{incident.location}</span>
                      </div>
                    )}
                    {incident.injuryDescription && (
                      <p className="text-xs sm:text-sm text-foreground/70 line-clamp-2">
                        <span className="font-semibold">Injuries: </span>
                        {incident.injuryDescription}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/50">
                      {incident.dispatchSubmitted
                        ? "✓ Dispatch Submitted"
                        : "Pending Dispatch"}
                    </span>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground group-hover:shadow-md transition-all text-xs sm:text-sm"
                    >
                      Resume
                      <ChevronRight className="ml-1 w-3.5 h-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
