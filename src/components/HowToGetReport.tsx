import { Card } from "@/components/ui/card";
import { Phone, FileText, AlertCircle } from "lucide-react";

const HowToGetReport = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          איך מוציאים דוח צריכה?
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          כל מה שצריך זה להתקשר לשירות לקוחות ולבקש מהם להוציא דו״ח צריכה, ואז
          הם ישלחו לך למייל
        </p>
      </div>

      {/* הוראות עיקריות */}
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-success/5 border border-primary/20">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <Phone className="w-8 h-8 text-primary-foreground" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                צעדים פשוטים:
              </h3>
              <ol className="space-y-3 text-lg text-foreground">
                <li className="flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  <span>התקשר לשירות לקוחות</span>
                </li>
                <li className="flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  <span>בקש מהם להוציא דו״ח צריכה</span>
                </li>
                <li className="flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </span>
                  <span>הם ישלחו לך למייל</span>
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                <FileText className="w-5 h-5" />
                <span>צריך לבקש באקסל ולנסות לכמה שיותר זמן אחורה</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">
                  שימו לב: זה זמין רק למי שיש מונה חשמל חכם בבית
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HowToGetReport;
