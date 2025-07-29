import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calculator as CalculatorIcon,
  TrendingDown,
  Clock,
  Sun,
  Moon,
  Users,
  TrendingUp,
} from "lucide-react";

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
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const parsed: ConsumptionData[] = jsonData
          .map((row: any, index: number) => {
            // Parse the date - try multiple approaches
            let date: Date;
            const dateString =
              row["תאריך התחלת הקריאה"] ||
              row["תאריך"] ||
              row["Date"] ||
              row["date"] ||
              row["תאריך קריאה"] ||
              row["זמן"] ||
              row["Time"] ||
              row["time"];

            if (dateString) {
              // Check if it's an Excel serial number (numeric value)
              if (
                typeof dateString === "number" ||
                !isNaN(Number(dateString))
              ) {
                const excelSerialNumber = Number(dateString);

                // Excel's epoch is January 1, 1900, but it incorrectly treats 1900 as a leap year
                // So we need to adjust for this
                const excelEpoch = new Date(1900, 0, 1);
                const millisecondsPerDay = 24 * 60 * 60 * 1000;

                // Subtract 2 days to account for Excel's leap year bug
                const adjustedDays = excelSerialNumber - 2;
                const totalMilliseconds = adjustedDays * millisecondsPerDay;

                date = new Date(excelEpoch.getTime() + totalMilliseconds);
              } else {
                // Try to parse as a regular date string
                date = new Date(dateString);
              }

              // Check if the date is valid
              if (isNaN(date.getTime())) {
                console.warn(
                  "Invalid date parsed:",
                  dateString,
                  "Falling back to current date"
                );
                date = new Date();
              }
            } else {
              console.warn("No date found in row, using current date");
              date = new Date();
            }

            const consumption = parseFloat(
              row['צריכה מהרשת (קוט"ש)'] ||
                row["צריכה"] ||
                row["Consumption"] ||
                row["consumption"] ||
                row["קוטש"] ||
                row["kWh"] ||
                "0"
            );

            // Calculate day of week based on Israel time zone
            const jerusalemDate = new Date(
              date.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
            );
            const dayOfWeek = jerusalemDate.getDay(); // Sunday = 0

            const result = {
              date,
              consumption,
              hour: date.getHours(),
              dayOfWeek: dayOfWeek,
            };

            return result;
          })
          .filter((item) => !isNaN(item.consumption) && item.consumption > 0);

        resolve(parsed);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const calculatePlanCost = (
    data: ConsumptionData[],
    discountRate: number,
    timeCondition?: (hour: number, dayOfWeek: number) => boolean
  ): number => {
    const baseRate = 0.64; // תעריף בסיס ל-kWh

    return data.reduce((total, item) => {
      let rate = baseRate;

      if (timeCondition && timeCondition(item.hour, item.dayOfWeek)) {
        rate = baseRate * (1 - discountRate);
      } else if (!timeCondition) {
        // הנחה קבועה
        rate = baseRate * (1 - discountRate);
      }

      return total + item.consumption * rate;
    }, 0);
  };

  const calculateResults = useCallback(async () => {
    setIsCalculating(true);

    try {
      const data = await parseFile(file);

      // בדיקה: אילו שורות מסומנות כהנחה לילית
      const nightRows = data.filter((item) => {
        const isWeekday = item.dayOfWeek >= 0 && item.dayOfWeek <= 4; // Sunday–Thursday
        const isNightHour = item.hour >= 23 || item.hour < 7;
        return isWeekday && isNightHour;
      });

      // סכום הצריכה בלילה
      const totalNightConsumption = nightRows.reduce(
        (sum, item) => sum + item.consumption,
        0
      );
      console.log("Total night discount rows:", nightRows.length);
      console.log(
        "Total night consumption (kWh):",
        totalNightConsumption.toFixed(3)
      );

      // הצג דוגמה של כמה שורות
      nightRows.slice(0, 5).forEach((item, index) => {
        console.log(`Night row #${index + 1}:`, {
          date: item.date.toISOString(),
          hour: item.hour,
          dayOfWeek: item.dayOfWeek,
          consumption: item.consumption,
        });
      });

      setConsumptionData(data);

      if (data.length === 0) {
        throw new Error("לא נמצאו נתוני צריכה בקובץ");
      }

      // Calculate data distribution for internal use

      const baseCost = data.reduce(
        (total, item) => total + item.consumption * 0.64,
        0
      );

      const plans: PlanResult[] = [];

      // תעריף רגיל (ללא הנחה) - בסיס להשוואה
      plans.push({
        name: "תעריף רגיל",
        totalCost: baseCost,
        savings: 0,
        savingsPercentage: 0,
        icon: <CalculatorIcon className="h-5 w-5" />,
        description: "ללא הנחה",
      });

      // Calculate day plan with 15% discount on weekdays 7-17
      let dayPlanTotalCost = 0;
      let discountAppliedCount = 0;
      let totalItems = 0;

      data.forEach((item) => {
        const isWeekday = item.dayOfWeek >= 0 && item.dayOfWeek <= 4; // Sunday = 0, Thursday = 4
        const isDayTime = item.hour >= 7 && item.hour < 17; // 7 AM to 5 PM
        const shouldApplyDiscount = isWeekday && isDayTime;

        if (shouldApplyDiscount) {
          discountAppliedCount++;
        }
        totalItems++;

        const rate = shouldApplyDiscount ? 0.64 * 0.85 : 0.64; // 15% discount or regular rate
        dayPlanTotalCost += item.consumption * rate;
      });

      plans.push({
        name: "הנחה יומית 15%",
        totalCost: dayPlanTotalCost,
        savings: baseCost - dayPlanTotalCost,
        savingsPercentage: ((baseCost - dayPlanTotalCost) / baseCost) * 100,
        icon: <Sun className="h-5 w-5" />,
        description: "ימות השבוע 07:00-17:00",
      });

      // Calculate night plan with 20% discount on weekdays 23:00-7:00
      let nightPlanTotalCost = 0;
      let nightDiscountAppliedCount = 0;

      data.forEach((item) => {
        const isWeekday = item.dayOfWeek >= 0 && item.dayOfWeek <= 4; // Sunday = 0, Thursday = 4
        const isNightTime = item.hour >= 23 || item.hour < 7; // 11 PM to 7 AM
        const shouldApplyDiscount = isWeekday && isNightTime;

        if (shouldApplyDiscount) {
          nightDiscountAppliedCount++;
        }

        const rate = shouldApplyDiscount ? 0.64 * 0.8 : 0.64; // 20% discount or regular rate
        nightPlanTotalCost += item.consumption * rate;
      });

      const nightDiscountCost = nightPlanTotalCost;
      plans.push({
        name: "הנחה לילית 20%",
        totalCost: nightDiscountCost,
        savings: baseCost - nightDiscountCost,
        savingsPercentage: ((baseCost - nightDiscountCost) / baseCost) * 100,
        icon: <Moon className="h-5 w-5" />,
        description: "כל הלילה 23:00-07:00",
      });

      // Calculate family plan with 18% discount on weekdays 14:00-20:00
      let familyPlanTotalCost = 0;
      let familyDiscountAppliedCount = 0;

      data.forEach((item) => {
        const isWeekday = item.dayOfWeek >= 0 && item.dayOfWeek <= 4; // Sunday = 0, Thursday = 4
        const isFamilyTime = item.hour >= 14 && item.hour < 20; // 2 PM to 8 PM
        const shouldApplyDiscount = isWeekday && isFamilyTime;

        if (shouldApplyDiscount) {
          familyDiscountAppliedCount++;
        }

        const rate = shouldApplyDiscount ? 0.64 * 0.82 : 0.64; // 18% discount or regular rate
        familyPlanTotalCost += item.consumption * rate;
      });

      plans.push({
        name: "חוסכים למשפחה 18%",
        totalCost: familyPlanTotalCost,
        savings: baseCost - familyPlanTotalCost,
        savingsPercentage: ((baseCost - familyPlanTotalCost) / baseCost) * 100,
        icon: <Users className="h-5 w-5" />,
        description: "ימות השבוע 14:00-20:00",
      });

      // Calculate consumption-based discount plan (up to 10% based on monthly consumption)
      const monthlyConsumption = data.reduce(
        (total, item) => total + item.consumption,
        0
      );
      const monthlyCost = monthlyConsumption * 0.64;

      let consumptionDiscountRate = 0;
      if (monthlyCost <= 149) {
        consumptionDiscountRate = 0.1; // 10% discount
      } else if (monthlyCost <= 199) {
        consumptionDiscountRate = 0.08; // 8% discount
      } else if (monthlyCost <= 299) {
        consumptionDiscountRate = 0.06; // 6% discount
      } else {
        consumptionDiscountRate = 0.05; // 5% discount
      }

      const consumptionBasedCost = baseCost * (1 - consumptionDiscountRate);

      plans.push({
        name: "חשבון קטן הנחה גדולה",
        totalCost: consumptionBasedCost,
        savings: baseCost - consumptionBasedCost,
        savingsPercentage: ((baseCost - consumptionBasedCost) / baseCost) * 100,
        icon: <TrendingUp className="h-5 w-5" />,
        description: `${consumptionDiscountRate * 100}% הנחה לפי צריכה חודשית`,
      });

      // Add custom plans if any
      if (customPlans && customPlans.length > 0) {
        customPlans.forEach((customPlan) => {
          // Convert day string IDs to numeric values
          const dayMapping: { [key: string]: number } = {
            sun: 0, // Sunday
            mon: 1, // Monday
            tue: 2, // Tuesday
            wed: 3, // Wednesday
            thu: 4, // Thursday
            fri: 5, // Friday
            sat: 6, // Saturday
          };

          const customCost = calculatePlanCost(
            data,
            customPlan.discount / 100,
            (hour, dayOfWeek) => {
              const isInTimeRange =
                hour >= customPlan.startHour && hour < customPlan.endHour;
              const isInDayRange = customPlan.days.some(
                (dayId: string) => dayMapping[dayId] === dayOfWeek
              );
              return isInTimeRange && isInDayRange;
            }
          );

          plans.push({
            name: customPlan.name,
            totalCost: customCost,
            savings: baseCost - customCost,
            savingsPercentage: ((baseCost - customCost) / baseCost) * 100,
            icon: <Clock className="h-5 w-5" />,
            description: `הנחה ${customPlan.discount}% - ${customPlan.startHour}:00-${customPlan.endHour}:00`,
          });
        });
      }

      // Sort by total cost, but keep תעריף רגיל first
      plans.sort((a, b) => {
        if (a.name === "תעריף רגיל") return -1;
        if (b.name === "תעריף רגיל") return 1;
        return a.totalCost - b.totalCost;
      });

      setResults(plans);
    } catch (error) {
      console.error("Error calculating results:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [file, customPlans]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    if (file) {
      calculateResults();
    }
  }, [file, customPlans, calculateResults]);

  const getBestPlan = () => {
    if (results.length <= 1) return null;
    // Find the plan with the highest savings (excluding the base plan)
    const plansWithSavings = results.filter((plan) => plan.savings > 0);
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
          {isCalculating ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">מחשב תוצאות...</span>
              </div>
              <p className="text-muted-foreground">
                מעבד את הנתונים ומשווה את כל המסלולים
              </p>
            </div>
          ) : results.length > 0 ? (
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
                    <p className="text-muted-foreground mb-4">
                      {bestPlan.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          עלות חודשית
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(bestPlan.totalCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          חיסכון חודשי
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(bestPlan.savings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          אחוז חיסכון
                        </p>
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
                <h3 className="text-lg font-semibold mb-4">
                  השוואה מפורטת של כל המסלולים
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>מסלול</TableHead>
                      <TableHead>תיאור</TableHead>
                      <TableHead className="text-right">עלות חודשית</TableHead>
                      <TableHead className="text-right">חיסכון</TableHead>
                      <TableHead className="text-right">אחוז חיסכון</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((plan, index) => (
                      <TableRow
                        key={index}
                        className={plan === bestPlan ? "bg-primary/5" : ""}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {plan.icon}
                            {plan.name}
                            {plan === bestPlan && index > 0 && (
                              <Badge variant="default" className="ml-2">
                                מומלץ
                              </Badge>
                            )}
                            {index === 0 && (
                              <Badge variant="outline" className="ml-2">
                                בסיס
                              </Badge>
                            )}
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
                      <h4 className="font-semibold mb-2">
                        סיכום החיסכון השנתי
                      </h4>
                      <p className="text-2xl font-bold text-green-600">
                        חיסכון של {formatCurrency(bestPlan.savings * 12)} בשנה!
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        * החישוב מבוסס על נתוני הצריכה שהועלו ועשוי להשתנות
                        בהתאם לשינויים בדפוסי הצריכה
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
