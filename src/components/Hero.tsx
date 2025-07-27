import { Button } from "@/components/ui/button";
import { Zap, Calculator, TrendingDown } from "lucide-react";
import heroImage from "@/assets/hero-electricity.jpg";

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] bg-gradient-bg overflow-hidden">
      {/* רקע עם תמונה */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="מונה חשמל חכם" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-success/10" />
      </div>

      {/* תוכן */}
      <div className="relative container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* כותרת ראשית */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            בחר את המסלול החכם
            <span className="bg-gradient-primary bg-clip-text text-transparent block">
              וחסוך בחשמל
            </span>
          </h1>

          {/* תת כותרת */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            העלה את דוח הצריכה שלך ותגלה איזה מסלול במונה החכם יחסוך לך הכי הרבה כסף
          </p>

          {/* כפתורי פעולה */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg">
              <Calculator className="w-5 h-5" />
              התחל לחסוך עכשיו
            </Button>
            <Button variant="outline" size="lg">
              איך זה עובד?
            </Button>
          </div>

          {/* סטטיסטיקות */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border shadow-card">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">עד 20%</h3>
              <p className="text-muted-foreground">חיסכון בחשבון החשמל</p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border shadow-card">
              <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-success-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">3 מסלולים</h3>
              <p className="text-muted-foreground">להתאמה אישית</p>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border shadow-card">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">חישוב מיידי</h3>
              <p className="text-muted-foreground">תוצאות תוך שניות</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;