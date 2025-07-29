import { Button } from "@/components/ui/button";
import { Calculator, FileText, Zap } from "lucide-react";
import heroImage from "@/assets/hero-electricity.jpg";

interface HeroProps {
  onStartCalculation: () => void;
  onShowInstructions: () => void;
}

const Hero = ({ onStartCalculation, onShowInstructions }: HeroProps) => {
  return (
    <div className="relative bg-gradient-bg border-b border-border">
      {/* רקע עם תמונה */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="מונה חשמל חכם"
          className="w-full h-full object-cover opacity-15"
        />
      </div>

      {/* תוכן */}
      <div className="relative container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* כותרת ראשית */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            מחשבון מסלולי חשמל
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              מצא את המסלול הכי משתלם
            </span>
          </h1>

          {/* תת כותרת */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            העלה דוח צריכה או הגדר מסלול מותאם אישית - תדע מיד איזה מסלול יחסוך
            לך הכי הרבה כסף
          </p>

          {/* כפתורי פעולה */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" onClick={onStartCalculation}>
              <Calculator className="w-5 h-5" />
              התחל חישוב
            </Button>
            <Button variant="outline" onClick={onShowInstructions}>
              <FileText className="w-5 h-5" />
              איך מוציאים דוח צריכה?
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
