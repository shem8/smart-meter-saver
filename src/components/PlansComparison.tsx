import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingDown, Zap } from "lucide-react";

const PlansComparison = () => {
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
      color: "muted"
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
      color: "primary"
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
      color: "success"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            3 מסלולי חיסכון לבחירה
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            כל מסלול מותאם לסוג שימוש שונה. העלה את דוח הצריכה שלך ונמצא לך את המסלול הכי משתלם
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            
            return (
              <Card 
                key={plan.id} 
                className="p-8 bg-card border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                {/* רקע גרדיאנט עדין */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  plan.color === 'primary' ? 'from-primary/5 to-primary-glow/5' :
                  plan.color === 'success' ? 'from-success/5 to-secondary/5' :
                  'from-muted/5 to-accent/5'
                }`} />
                
                <div className="relative">
                  {/* אייקון ותווית הנחה */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      plan.color === 'primary' ? 'bg-gradient-primary' :
                      plan.color === 'success' ? 'bg-gradient-success' :
                      'bg-muted'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        plan.color === 'muted' ? 'text-muted-foreground' : 'text-white'
                      }`} />
                    </div>
                    <Badge variant={plan.color === 'muted' ? 'secondary' : 'default'} className="text-lg px-3 py-1">
                      {plan.discount}
                    </Badge>
                  </div>

                  {/* כותרת ותיאור */}
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* תכונות */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          plan.color === 'primary' ? 'bg-primary' :
                          plan.color === 'success' ? 'bg-success' :
                          'bg-muted-foreground'
                        }`} />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
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