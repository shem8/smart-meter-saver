import { useState, useEffect, useCallback } from "react";
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
  Sun,
  Moon,
  Users,
  TrendingUp,
  Clock,
  User,
  MapPin,
  Hash,
} from "lucide-react";
import { parseFile, ConsumptionData, FileMetadata } from "@/lib/fileParser";
import {
  calculateResults,
  getBestPlan,
  PlanResult,
  CustomPlan,
} from "@/lib/calculatorLogic";

interface CalculatorProps {
  file: File;
  selectedPlan?: string;
  customPlans?: CustomPlan[];
}

const Calculator = ({ file, selectedPlan, customPlans }: CalculatorProps) => {
  const [results, setResults] = useState<PlanResult[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [consumptionData, setConsumptionData] = useState<ConsumptionData[]>([]);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);

  const calculateResultsCallback = useCallback(async () => {
    setIsCalculating(true);

    try {
      const parsedData = await parseFile(file);

      if (parsedData.consumptionData.length === 0) {
        throw new Error("לא נמצאו נתוני צריכה בקובץ");
      }

      setConsumptionData(parsedData.consumptionData);
      setMetadata(parsedData.metadata);
      const calculatedResults = await calculateResults(
        parsedData.consumptionData,
        customPlans
      );
      setResults(calculatedResults);
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
      calculateResultsCallback();
    }
  }, [file, customPlans, calculateResultsCallback]);

  const bestPlan = getBestPlan(results);

  const getIconComponent = (iconName: string) => {
    const iconProps = { className: "h-5 w-5" };
    switch (iconName) {
      case "calculator":
        return <CalculatorIcon {...iconProps} />;
      case "sun":
        return <Sun {...iconProps} />;
      case "moon":
        return <Moon {...iconProps} />;
      case "users":
        return <Users {...iconProps} />;
      case "trending-up":
        return <TrendingUp {...iconProps} />;
      case "clock":
        return <Clock {...iconProps} />;
      default:
        return <CalculatorIcon {...iconProps} />;
    }
  };

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
          {metadata && (
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  פרטי לקוח
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">שם לקוח:</span>
                      <span>{metadata.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">כתובת:</span>
                      <span>{metadata.customerAddress}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">קוד מונה:</span>
                      <span>{metadata.meterCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">מספר מונה:</span>
                      <span>{metadata.meterNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">מספר חוזה:</span>
                      <span>{metadata.contractNumber}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
              {bestPlan && (
                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-center text-primary flex items-center justify-center gap-2">
                      🏆 המסלול המומלץ עבורך
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {getIconComponent(bestPlan.icon)}
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

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  פירוט עלות לפי חודש
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>חודש</TableHead>
                      {results.map((plan, index) => (
                        <TableHead key={index} className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            {getIconComponent(plan.icon)}
                            <span className="text-xs">{plan.name}</span>
                            {plan === bestPlan && (
                              <Badge variant="default" className="text-xs">
                                מומלץ
                              </Badge>
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results[0]?.monthlyBreakdown.map(
                      (monthData, monthIndex) => (
                        <TableRow key={monthIndex}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{monthData.month}</div>
                              <div className="text-xs text-muted-foreground">
                                {monthData.totalConsumption.toFixed(0)} קוט"ש
                              </div>
                            </div>
                          </TableCell>
                          {results.map((plan, planIndex) => {
                            const monthlyPlan =
                              plan.monthlyBreakdown[monthIndex];
                            if (!monthlyPlan) return null;

                            const planBreakdown = monthlyPlan.plans.find(
                              (p) => p.name === plan.name
                            );
                            let monthlyCost = 0;
                            let monthlySavings = 0;
                            let monthlySavingsPercentage = 0;

                            if (plan.name === "תעריף רגיל") {
                              monthlyCost = monthlyPlan.baseCost;
                              monthlySavings = 0;
                              monthlySavingsPercentage = 0;
                            } else if (planBreakdown) {
                              monthlyCost = planBreakdown.cost;
                              monthlySavings = planBreakdown.savings;
                              monthlySavingsPercentage =
                                planBreakdown.savingsPercentage;
                            } else {
                              monthlyCost = monthlyPlan.baseCost;
                              monthlySavings = 0;
                              monthlySavingsPercentage = 0;
                            }

                            return (
                              <TableCell
                                key={planIndex}
                                className="text-center"
                              >
                                <div className="flex flex-col gap-1">
                                  <div className="font-mono text-sm">
                                    {formatCurrency(monthlyCost)}
                                  </div>
                                  {monthlySavings > 0 && (
                                    <div className="text-xs text-green-600">
                                      חיסכון: {formatCurrency(monthlySavings)}
                                    </div>
                                  )}
                                  {monthlySavings > 0 && (
                                    <div className="text-xs text-green-600 font-medium">
                                      {monthlySavingsPercentage.toFixed(1)}%
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      )
                    )}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>
                        <div>
                          <div>ממוצע חודשי</div>
                          <div className="text-xs text-muted-foreground">
                            {results[0]?.monthlyBreakdown
                              .reduce(
                                (sum, month) => sum + month.totalConsumption,
                                0
                              )
                              .toFixed(0)}{" "}
                            קוט"ש
                          </div>
                        </div>
                      </TableCell>
                      {results.map((plan, planIndex) => {
                        const avgMonthlyCost =
                          plan.totalCost /
                          (results[0]?.monthlyBreakdown.length || 1);
                        const avgMonthlySavings =
                          plan.savings /
                          (results[0]?.monthlyBreakdown.length || 1);
                        const avgMonthlySavingsPercentage =
                          (avgMonthlySavings / avgMonthlyCost) * 100;

                        return (
                          <TableCell key={planIndex} className="text-center">
                            <div className="flex flex-col gap-1">
                              <div className="font-mono text-sm">
                                {formatCurrency(avgMonthlyCost)}
                              </div>
                              {avgMonthlySavings > 0 && (
                                <div className="text-xs text-green-600">
                                  חיסכון: {formatCurrency(avgMonthlySavings)}
                                </div>
                              )}
                              {avgMonthlySavings > 0 && (
                                <div className="text-xs text-green-600 font-medium">
                                  {avgMonthlySavingsPercentage.toFixed(1)}%
                                </div>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

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

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  השוואה מפורטת של כל המסלולים (ממוצע חודשי)
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>מסלול</TableHead>
                      <TableHead>תיאור</TableHead>
                      <TableHead className="text-right">
                        עלות חודשית ממוצעת
                      </TableHead>
                      <TableHead className="text-right">
                        חיסכון חודשי ממוצע
                      </TableHead>
                      <TableHead className="text-right">אחוז חיסכון</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((plan, index) => {
                      const avgMonthlyCost =
                        plan.totalCost /
                        (results[0]?.monthlyBreakdown.length || 1);
                      const avgMonthlySavings =
                        plan.savings /
                        (results[0]?.monthlyBreakdown.length || 1);

                      return (
                        <TableRow
                          key={index}
                          className={plan === bestPlan ? "bg-primary/5" : ""}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {getIconComponent(plan.icon)}
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
                            {formatCurrency(avgMonthlyCost)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {avgMonthlySavings > 0 ? (
                              <span className="text-green-600">
                                {formatCurrency(avgMonthlySavings)}
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
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
