import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShieldAlert, Ambulance, Shield, Globe, ChevronRight } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useState, useRef } from "react";

interface SosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SwipeToCall({ number, label, icon: Icon, colorClass, onCall }: any) {
  const [isCalling, setIsCalling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const handleDragEnd = async (event: any, info: any) => {
    const containerWidth = containerRef.current?.offsetWidth || 300;
    const threshold = containerWidth * 0.6; // 60% of container to trigger call

    if (info.offset.x > threshold) {
      setIsCalling(true);
      controls.start({ x: containerWidth - 64 }); // Animate to end
      
      // Trigger call
      window.location.href = `tel:${number}`;
      
      // Reset after a delay
      setTimeout(() => {
        setIsCalling(false);
        controls.start({ x: 0 });
        if (onCall) onCall();
      }, 1500);
    } else {
      // Snap back
      controls.start({ x: 0 });
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center h-16 rounded-full overflow-hidden border ${colorClass} bg-background/50`}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`font-bold text-lg opacity-80 ${isCalling ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
          Swipe to Call {label}
        </span>
      </div>
      
      {isCalling && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="font-bold text-lg animate-pulse">Calling {number}...</span>
        </div>
      )}

      <motion.div
        drag="x"
        dragConstraints={containerRef}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="absolute left-1 top-1 bottom-1 w-14 rounded-full bg-current flex items-center justify-center cursor-grab active:cursor-grabbing z-20 shadow-lg"
      >
        <Icon className="w-6 h-6 text-background" />
        <ChevronRight className="w-4 h-4 text-background absolute -right-2 opacity-50" />
      </motion.div>
    </div>
  );
}

export function SosModal({ open, onOpenChange }: SosModalProps) {
  // Ordered with Ambulance as first priority
  const options = [
    {
      title: "Ambulance",
      number: "108",
      icon: Ambulance,
      colorClass: "text-red-500 border-red-500/50 hover:bg-red-500/10"
    },
    {
      title: "Police",
      number: "100",
      icon: Shield,
      colorClass: "text-blue-500 border-blue-500/50 hover:bg-blue-500/10"
    },
    {
      title: "Universal Helpline",
      number: "112",
      icon: Globe,
      colorClass: "text-primary border-primary/50 hover:bg-primary/10"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur border-border/50">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-2 animate-pulse">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Emergency SOS
          </DialogTitle>
          <DialogDescription className="text-foreground/80 text-base">
            Select the emergency service you need to contact immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {options.map((opt) => (
            <SwipeToCall
              key={opt.title}
              label={opt.title}
              number={opt.number}
              icon={opt.icon}
              colorClass={opt.colorClass}
              onCall={() => onOpenChange(false)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
