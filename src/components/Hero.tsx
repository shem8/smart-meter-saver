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
            העלה דוח צריכה או הגדר מסלול מותאם אישית - תדע מיד איזה מסלול יחסוך לך הכי הרבה כסף
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

          {/* פיצ'רים מהירים */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Calculator className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-foreground">חישוב מיידי</h3>
                <p className="text-sm text-muted-foreground">תוצאות תוך שניות</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
              <div className="w-10 h-10 bg-gradient-success rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-success-foreground" />
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-foreground">מסלול מותאם</h3>
                <p className="text-sm text-muted-foreground">הגדר מסלול משלך</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-foreground">ללא רישום</h3>
                <p className="text-sm text-muted-foreground">משתמש ישירות</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;