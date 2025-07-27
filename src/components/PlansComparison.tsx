import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingDown, Zap, Settings } from "lucide-react";

interface PlansComparisonProps {
  onSelectPreset: (planType: string) => void;
  onCreateCustom: () => void;
}

const PlansComparison = ({ onSelectPreset, onCreateCustom }: PlansComparisonProps) => {
  const plans = [
    {
      id: "fixed",
      name: "הנחה קבועה",
      discount: "6%",
      description: "הנחה קבועה ללא צורך במונה חכם",
      icon: TrendingDown,
      features: [
        "6% הנחה על כל השימוש",
        "ללא צורך במונה חכם", 
        "פשוט ונוח",
        "מתאים לכל סוגי השימוש"
      ],
      color: "muted",
      action: () => onSelectPreset("fixed")
    },
    {
      id: "day",
      name: "מסלול יום",
      discount: "15%",
      description: "הנחה בימות השבוע בין 07:00-17:00",
      icon: Clock,
      features: [
        "15% הנחה בשעות היום",
        "ימות השבוע בלבד",
        "07:00-17:00",
        "מתאים לעבודה מהבית"
      ],
      color: "primary",
      action: () => onSelectPreset("day")
    },
    {
      id: "night",
      name: "מסלול לילה", 
      discount: "20%",
      description: "הנחה מקסימלית בשעות הלילה",
      icon: Zap,
      features: [
        "20% הנחה בלילה",
        "כל ימות השבוע",
        "23:00-07:00", 
        "מתאים למכשירים אוטומטיים"
      ],
      color: "success",
      action: () => onSelectPreset("night")
    },
    {
      id: "custom",
      name: "מסלול מותאם",
      discount: "?%",
      description: "הגדר את המסלולים של הספק שלך",
      icon: Settings,
      features: [
        "הגדר שעות בעצמך",
        "אחוזי הנחה גמישים",
        "מספר מסלולים",
        "התאמה מושלמת"
      ],
      color: "accent",
      action: onCreateCustom
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            בחר מסלול או צור מותאם אישית
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            בחר אחד מהמסלולים הנפוצים או הגדר מסלול מותאם לספק שלך
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.id} 
                className="p-6 bg-card border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 relative overflow-hidden cursor-pointer"
                onClick={plan.action}
              >
                {/* רקע גרדיאנט עדין */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  plan.color === 'primary' ? 'from-primary/5 to-primary-glow/5' :
                  plan.color === 'success' ? 'from-success/5 to-secondary/5' :
                  plan.color === 'accent' ? 'from-accent/10 to-muted/10' :
                  'from-muted/5 to-accent/5'
                }`} />
                
                <div className="relative">
                  {/* אייקון ותווית הנחה */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      plan.color === 'primary' ? 'bg-gradient-primary' :
                      plan.color === 'success' ? 'bg-gradient-success' :
                      plan.color === 'accent' ? 'bg-accent' :
                      'bg-muted'
                    }`}>
                      <IconComponent className={`w-5 h-5 ${
                        plan.color === 'muted' || plan.color === 'accent' ? 'text-muted-foreground' : 'text-white'
                      }`} />
                    </div>
                    <Badge variant={plan.color === 'muted' ? 'secondary' : 'default'} className="px-2 py-1">
                      {plan.discount}
                    </Badge>
                  </div>

                  {/* כותרת ותיאור */}
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* תכונות */}
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          plan.color === 'primary' ? 'bg-primary' :
                          plan.color === 'success' ? 'bg-success' :
                          plan.color === 'accent' ? 'bg-accent-foreground' :
                          'bg-muted-foreground'
                        }`} />
                        <span className="text-xs text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* כפתור פעולה */}
                  <Button 
                    variant={plan.id === 'custom' ? 'secondary' : 'outline'} 
                    size="sm" 
                    className="w-full"
                    onClick={plan.action}
                  >
                    {plan.id === 'custom' ? 'צור מסלול' : 'בחר מסלול זה'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlansComparison;