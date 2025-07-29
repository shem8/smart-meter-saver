import { useState } from "react";
import Hero from "@/components/Hero";
import FileUpload from "@/components/FileUpload";
import HowToGetReport from "@/components/HowToGetReport";
import CustomPlan from "@/components/CustomPlan";
import Calculator from "@/components/Calculator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Upload,
  Calculator as CalculatorIcon,
  Settings,
  TrendingDown,
  Clock,
  Zap,
  HelpCircle,
  Sun,
  Moon,
  Users,
  TrendingUp,
} from "lucide-react";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customPlans, setCustomPlans] = useState<any[]>([]);
  const [showCustomPlan, setShowCustomPlan] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const predefinedPlans = [
    {
      id: "day",
      name: "חוסכים ביום",
      discount: "15%",
      description: "15% הנחה בימי א'-ה' 7:00 עד 17:00",
      icon: Sun,
      features: [
        "15% הנחה בשעות היום",
        "בימי א'-ה'",
        "בין השעות 7:00 עד 17:00",
        "מומלץ לעובדים מהבית",
      ],
      color: "primary",
    },
    {
      id: "night",
      name: "חוסכים בלילה",
      discount: "20%",
      description: "20% הנחה בימי א'-ה' 23:00 עד 7:00 למחרת",
      icon: Moon,
      features: [
        "20% הנחה בלילה",
        "בימי א'-ה'",
        "בין השעות 23:00 עד 7:00 למחרת",
        "למדליקים מזגן בלילה ולבעלי רכב חשמלי",
      ],
      color: "success",
    },
    {
      id: "family",
      name: "חוסכים למשפחה",
      discount: "18%",
      description: "18% הנחה בימי א'-ה' 14:00 עד 20:00",
      icon: Users,
      features: [
        "18% הנחה בשעות המשפחה",
        "בימי א'-ה'",
        "בין השעות 14:00 עד 20:00",
        "מומלץ למשפחות",
      ],
      color: "secondary",
    },
    {
      id: "consumption",
      name: "חשבון קטן הנחה גדולה",
      discount: "עד 10%",
      description: "עד 10% הנחה לפי צריכה חודשית",
      icon: TrendingUp,
      features: [
        "גובה הנחה של 10% בצריכה חודשית עד 149 ₪",
        "גובה הנחה של 8% בצריכה חודשית עד 199 ₪",
        "גובה הנחה של 6% בצריכה חודשית עד 299 ₪",
        "גובה הנחה 5% בצריכה חודשית מ300 ₪ ומעלה",
      ],
      color: "muted",
    },
  ];

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setShowResults(true);
  };

  const handleCustomPlanSelect = (customPlan: any[]) => {
    setCustomPlans(customPlan);
    setShowCustomPlan(false);
  };

  const resetCalculation = () => {
    setSelectedFile(null);
    setCustomPlans([]);
    setShowResults(false);
    setShowCustomPlan(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero
        onStartCalculation={() => {}}
        onShowInstructions={() => setShowInstructions(true)}
      />

      <div className="container mx-auto px-6 py-8 space-y-12">
        {/* Plans Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              מסלולי חיסכון פופולריים
            </h2>
            <p className="text-lg text-muted-foreground">
              כל המסלולים יושוו אוטומטית עם הנתונים שלך
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {predefinedPlans.map((plan) => {
              const IconComponent = plan.icon;

              return (
                <Card
                  key={plan.id}
                  className="p-6 bg-card border border-border shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 relative overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      plan.color === "primary"
                        ? "from-primary/5 to-primary-glow/5"
                        : plan.color === "success"
                        ? "from-success/5 to-secondary/5"
                        : "from-muted/5 to-accent/5"
                    }`}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          plan.color === "primary"
                            ? "bg-gradient-primary"
                            : plan.color === "success"
                            ? "bg-gradient-success"
                            : "bg-muted"
                        }`}
                      >
                        <IconComponent
                          className={`w-5 h-5 ${
                            plan.color === "muted"
                              ? "text-muted-foreground"
                              : "text-white"
                          }`}
                        />
                      </div>
                      <Badge variant="default" className="px-2 py-1">
                        {plan.discount}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {plan.description}
                    </p>

                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              plan.color === "primary"
                                ? "bg-primary"
                                : plan.color === "success"
                                ? "bg-success"
                                : "bg-muted-foreground"
                            }`}
                          />
                          <span className="text-xs text-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-6 border-dashed border-2 border-accent">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                מסלול מותאם אישית
              </h3>
              <p className="text-muted-foreground mb-4">
                הגדר את המסלולים של הספק שלך עם שעות ואחוזי הנחה מותאמים
              </p>
              <Button
                onClick={() => setShowCustomPlan(true)}
                variant="outline"
                size="lg"
              >
                צור מסלול מותאם
              </Button>
            </div>
          </Card>

          {showCustomPlan && (
            <Card className="p-6 mt-6">
              <CustomPlan onPlanSelect={handleCustomPlanSelect} />
            </Card>
          )}

          {customPlans.length > 0 && (
            <Card className="p-6 bg-success/5 border-success mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-success rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      מסלולים מותאמים אישית
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {customPlans.length} מסלולים מוגדרים
                    </p>
                  </div>
                </div>
                <Badge variant="default">{customPlans.length} מסלולים</Badge>
              </div>
            </Card>
          )}
        </section>

        {/* File Upload Section */}
        {!showResults && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                העלה את דוח הצריכה שלך
              </h2>
              <p className="text-lg text-muted-foreground">
                העלה קובץ CSV או Excel עם נתוני הצריכה שלך
              </p>
            </div>

            <FileUpload onFileSelect={handleFileSelect} />
          </section>
        )}

        {/* Results Section */}
        {showResults && selectedFile && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  תוצאות ההשוואה
                </h2>
                <p className="text-muted-foreground">
                  קובץ: {selectedFile.name} | מסלולים:{" "}
                  {predefinedPlans.length + customPlans.length}
                </p>
              </div>
              <Button onClick={resetCalculation} variant="outline">
                חישוב חדש
              </Button>
            </div>

            <Calculator
              file={selectedFile}
              selectedPlan="fixed,day,night"
              customPlans={customPlans}
            />
          </section>
        )}
      </div>

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <HowToGetReport />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
