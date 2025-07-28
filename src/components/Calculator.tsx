import { useState } from "react";
import * as XLSX from 'xlsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator as CalculatorIcon, TrendingDown, Clock, Sun, Moon } from "lucide-react";

interface ConsumptionData {
  date: Date;
  consumption: number;
  hour: number;
  dayOfWeek: number;
}

interface PlanResult {
  name: string;
  totalCost: number;
  savings: number;
  savingsPercentage: number;
  icon: React.ReactNode;
  description: string;
}

interface CalculatorProps {
  file: File;
  selectedPlan?: string;
  customPlans?: any[];
}

const Calculator = ({ file, selectedPlan, customPlans }: CalculatorProps) => {
  const [results, setResults] = useState<PlanResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);

  const parseFile = async (file: File): Promise<ConsumptionData[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const parsed: ConsumptionData[] = jsonData.map((row: any) => {
          // Parse the date - handles various date formats
          let date: Date;
          const dateString = row['תאריך התחלת הקריאה'] || row['Date'] || row['date'];
          
          if (dateString) {
            date = new Date(dateString);
          } else {
            date = new Date();
          }

          const consumption = parseFloat(row['צריכה מהרשת (קוט"ש)'] || row['Consumption'] || row['consumption'] || '0');
          
          return {
            date,
            consumption,
            hour: date.getHours(),
            dayOfWeek: date.getDay() // 0 = Sunday, 6 = Saturday
          };
        }).filter(item => !isNaN(item.consumption) && item.consumption > 0);

        resolve(parsed);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const calculatePlanCost = (data: ConsumptionData[], discountRate: number, timeCondition?: (hour: number, dayOfWeek: number) => boolean): number => {
    const baseRate = 0.6; // תעריף בסיס ל-kWh (אפשר להתאים)
    
    return data.reduce((total, item) => {
      let rate = baseRate;
      
      if (timeCondition && timeCondition(item.hour, item.dayOfWeek)) {
        rate = baseRate * (1 - discountRate);
      } else if (!timeCondition) {
        // הנחה קבועה
        rate = baseRate * (1 - discountRate);
      }
      
      return total + (item.consumption * rate);
    }, 0);
  };

  const calculateResults = async () => {
    setIsCalculating(true);
    
    try {
      const data = await parseFile(file);
      setConsumptionData(data);
      
      if (data.length === 0) {
        throw new Error("לא נמצאו נתוני צריכה בקובץ");
      }

      const baseCost = data.reduce((total, item) => total + (item.consumption * 0.6), 0);
      
      const plans: PlanResult[] = [];

      // תעריף רגיל (ללא הנחה)
      plans.push({
        name: "תעריף רגיל",
        totalCost: baseCost,
        savings: 0,
        savingsPercentage: 0,
        icon: <CalculatorIcon className="h-5 w-5" />,
        description: "ללא הנחה"
      });

      // 6% הנחה קבועה
      const fixedDiscountCost = calculatePlanCost(data, 0.06);
      plans.push({
        name: "הנחה קבועה 6%",
        totalCost: fixedDiscountCost,
        savings: baseCost - fixedDiscountCost,
        savingsPercentage: 6,
        icon: <TrendingDown className="h-5 w-5" />,
        description: "הנחה קבועה כל השעות"
      });

      // 15% הנחה בימות השבוע 7:00-17:00
      const weekdayDiscountCost = calculatePlanCost(data, 0.15, (hour, dayOfWeek) => {
        return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 7 && hour < 17;
      });
      plans.push({
        name: "הנחה יומית 15%",
        totalCost: weekdayDiscountCost,
        savings: baseCost - weekdayDiscountCost,
        savingsPercentage: ((baseCost - weekdayDiscountCost) / baseCost) * 100,
        icon: <Sun className="h-5 w-5" />,
        description: "ימות השבוע 07:00-17:00"
      });

      // 20% הנחה בלילה 23:00-07:00
      const nightDiscountCost = calculatePlanCost(data, 0.20, (hour, dayOfWeek) => {
        return hour >= 23 || hour < 7;
      });
      plans.push({
        name: "הנחה לילית 20%",
        totalCost: nightDiscountCost,
        savings: baseCost - nightDiscountCost,
        savingsPercentage: ((baseCost - nightDiscountCost) / baseCost) * 100,
        icon: <Moon className="h-5 w-5" />,
        description: "כל הלילה 23:00-07:00"
      });

      // Add custom plans if any
      if (customPlans && customPlans.length > 0) {
        customPlans.forEach((customPlan) => {
          const customCost = calculatePlanCost(data, customPlan.discount / 100, (hour, dayOfWeek) => {
            const isInTimeRange = hour >= customPlan.startHour && hour < customPlan.endHour;
            const isInDayRange = customPlan.days.includes(dayOfWeek);
            return isInTimeRange && isInDayRange;
          });

          plans.push({
            name: customPlan.name,
            totalCost: customCost,
            savings: baseCost - customCost,
            savingsPercentage: ((baseCost - customCost) / baseCost) * 100,
            icon: <Clock className="h-5 w-5" />,
            description: `הנחה ${customPlan.discount}% - ${customPlan.startHour}:00-${customPlan.endHour}:00`
          });
        });
      }

      // Sort by total cost
      plans.sort((a, b) => a.totalCost - b.totalCost);
      
      setResults(plans);
    } catch (error) {
      console.error("Error calculating results:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getBestPlan = () => {
    if (results.length <= 1) return null;
    // Find the plan with the highest savings (excluding the base plan)
    const plansWithSavings = results.filter(plan => plan.savings > 0);
    if (plansWithSavings.length === 0) return null;
    return plansWithSavings.reduce((best, current) => 
      current.savings > best.savings ? current : best
    );
  };

  const bestPlan = getBestPlan();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <CalculatorIcon className="h-6 w-6" />
            חישוב מסלול חיסכון אופטימלי
          </CardTitle>
          <CardDescription>
            קובץ: {file.name} | נתוני צריכה: {consumptionData.length} רשומות
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {results.length === 0 ? (
            <div className="text-center">
              <Button 
                onClick={calculateResults} 
                disabled={isCalculating}
                size="lg"
                className="gap-2"
              >
                {isCalculating ? "מחשב..." : "חשב מסלול אופטימלי"}
                <CalculatorIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              {/* Best Plan Highlight */}
              {bestPlan && (
                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-center text-primary flex items-center justify-center gap-2">
                      🏆 המסלול המומלץ עבורך
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {bestPlan.icon}
                      <h3 className="text-2xl font-bold">{bestPlan.name}</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">{bestPlan.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">עלות חודשית</p>
                        <p className="text-2xl font-bold">{formatCurrency(bestPlan.totalCost)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">חיסכון חודשי</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(bestPlan.savings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">אחוז חיסכון</p>
                        <p className="text-2xl font-bold text-green-600">
                          {bestPlan.savingsPercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Separator />

              {/* Detailed Comparison */}
              <div>
                <h3 className="text-lg font-semibold mb-4">השוואה מפורטת של כל המסלולים</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>מסלול</TableHead>
                      <TableHead>תיאור</TableHead>
                      <TableHead className="text-right">עלות חודשית</TableHead>
                      <TableHead className="text-right">חיסכון</TableHead>
                      <TableHead className="text-right">אחוז חיסכון</TableHead>
                      <TableHead>סטטוס</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((plan, index) => (
                      <TableRow key={index} className={plan === bestPlan ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {plan.icon}
                            {plan.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {plan.description}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(plan.totalCost)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {plan.savings > 0 ? (
                            <span className="text-green-600">
                              {formatCurrency(plan.savings)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {plan.savingsPercentage > 0 ? (
                            <span className="text-green-600 font-medium">
                              {plan.savingsPercentage.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {plan === bestPlan && index > 0 && (
                            <Badge variant="default">מומלץ</Badge>
                          )}
                          {index === 0 && (
                            <Badge variant="outline">בסיס</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              {bestPlan && (
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">סיכום החיסכון השנתי</h4>
                      <p className="text-2xl font-bold text-green-600">
                        חיסכון של {formatCurrency(bestPlan.savings * 12)} בשנה!
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        * החישוב מבוסס על נתוני הצריכה שהועלו ועשוי להשתנות בהתאם לשינויים בדפוסי הצריכה
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;