import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Globe, FileText, Download } from "lucide-react";
import { useState } from "react";

const HowToGetReport = () => {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const companies = [
    {
      id: "electricity",
      name: "חברת החשמל",
      phone: "103",
      steps: [
        "התקשר ל-103 (שירות לקוחות)",
        "בחר באפשרות לשירותי מונים חכמים",
        "בקש 'דוח צריכה מפורט' או 'דוח שעתי'",
        "ציין את התקופה הרצויה (לפחות 3 חודשים)",
        "הדוח יישלח למייל או יהיה זמין באזור האישי"
      ]
    },
    {
      id: "iec",
      name: "חברת החשמל IEC",
      phone: "103", 
      website: "www.iec.co.il",
      steps: [
        "היכנס לאזור הלקוחות באתר IEC",
        "עבור לתפריט 'מונה חכם'",
        "בחר 'דוחות צריכה'",
        "בחר תקופה ובקש דוח מפורט",
        "הורד את הקובץ בפורמט CSV או Excel"
      ]
    },
    {
      id: "other",
      name: "ספקים אחרים",
      phone: "שירות לקוחות",
      steps: [
        "התקשר לשירות הלקוחות של הספק שלך",
        "בקש 'דוח צריכה מפורט' מהמונה החכם",
        "ודא שהדוח כולל נתונים שעתיים/יומיים",
        "בקש את הדוח בפורמט דיגיטלי (CSV/Excel)",
        "תקופה מומלצת: 3-6 חודשים אחרונים"
      ]
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            איך מוציאים דוח צריכה?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            כדי לחשב את המסלול הכי משתלם, אתה צריך דוח צריכה מפורט מהמונה החכם שלך
          </p>
        </div>

        {/* רשימת חברות */}
        <div className="max-w-4xl mx-auto space-y-4 mb-12">
          {companies.map((company) => (
            <Card key={company.id} className="overflow-hidden">
              <div 
                className="p-6 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setExpandedCompany(
                  expandedCompany === company.id ? null : company.id
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{company.name}</h3>
                      <p className="text-muted-foreground">טלפון: {company.phone}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {expandedCompany === company.id ? "סגור" : "הצג הוראות"}
                  </Button>
                </div>
              </div>

              {expandedCompany === company.id && (
                <div className="border-t border-border p-6 bg-accent/20">
                  <div className="space-y-4">
                    {company.website && (
                      <div className="flex items-center gap-2 text-primary mb-4">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">{company.website}</span>
                      </div>
                    )}
                    
                    <ol className="space-y-3">
                      {company.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* טיפים נוספים */}
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-success/5 border border-primary/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-success-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  טיפים חשובים לקבלת הדוח:
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• בקש דוח לתקופה של לפחות 3 חודשים אחרונים</li>
                  <li>• ודא שהדוח כולל נתונים שעתיים או יומיים</li>
                  <li>• העדף קובץ CSV או Excel על פני PDF</li>
                  <li>• אם אין לך מונה חכם, בקש להתקין ברכב</li>
                  <li>• שמור את פרטי ההתקשרות למקרה של שאלות</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowToGetReport;