import { Card } from "@/components/ui/card";
import { Monitor, FileText, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const HowToGetReport = () => {
  const handleDownloadExample = () => {
    const link = document.createElement("a");
    link.href = "/example.csv";
    link.download = "example-consumption-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-4">
          איך מוציאים דוח צריכה?
        </h3>
      </div>

      {/* הוראות עיקריות */}
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-success/5 border border-primary/20">
          <div className="text-center space-y-6">
            <div>
              <ol className="space-y-3 text-lg text-foreground">
                <li className="flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  <span>היכנס לחשבון שלך באתר חברת החשמל</span>
                </li>
                <li className="flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  <span>בקש דוח במייל</span>
                </li>
                <li className="flex items-center justify-center gap-3">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </span>
                  <span>מלא את המייל שלך וקבל את הקובץ CSV</span>
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                <FileText className="w-5 h-5" />
                <span>הקובץ יישלח בפורמט CSV וזמין תוך כמה דקות</span>
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

      {/* דוגמה להורדה */}
      <div className="max-w-2xl mx-auto">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                רוצה לראות איך הקובץ אמור להיראות?
              </h4>
              <p className="text-xs text-muted-foreground">
                הורד את קובץ הדוגמה כדי לראות את הפורמט הנכון
              </p>
            </div>

            <Button
              onClick={handleDownloadExample}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-3 h-3 mr-1" />
              הורד דוגמה
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HowToGetReport;
