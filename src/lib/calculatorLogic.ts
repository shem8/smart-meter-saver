import { ConsumptionData } from "./fileParser";

export interface MonthlyBreakdown {
  month: string;
  year: number;
  monthNumber: number;
  totalConsumption: number;
  baseCost: number;
  plans: {
    name: string;
    cost: number;
    savings: number;
    savingsPercentage: number;
  }[];
}

export interface PlanResult {
  name: string;
  totalCost: number;
  savings: number;
  savingsPercentage: number;
  icon: string;
  description: string;
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface CustomPlan {
  name: string;
  discount: number;
  startHour: number;
  endHour: number;
  days: string[];
  timeCondition?: (hour: number, dayOfWeek: number) => boolean;
  icon: string;
  description: string;
}

const BASE_RATE = 0.64;

const DAY_MAPPING: { [key: string]: number } = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

export const PREDEFINED_PLANS: CustomPlan[] = [
  {
    name: "הנחה יומית 15%",
    discount: 15,
    startHour: 7,
    endHour: 17,
    days: ["sun", "mon", "tue", "wed", "thu"],
    icon: "sun",
    description: "ימות השבוע 07:00-17:00",
  },
  {
    name: "הנחה לילית 20%",
    discount: 20,
    startHour: 23,
    endHour: 7,
    days: ["sun", "mon", "tue", "wed", "thu"],
    icon: "moon",
    description: "כל הלילה 23:00-07:00",
  },
  {
    name: "חוסכים למשפחה 18%",
    discount: 18,
    startHour: 14,
    endHour: 20,
    days: ["sun", "mon", "tue", "wed", "thu"],
    icon: "users",
    description: "ימות השבוע 14:00-20:00",
  },
];

export const calculatePlanCost = (
  data: ConsumptionData[],
  discountRate: number,
  timeCondition?: (hour: number, dayOfWeek: number) => boolean
): number => {
  return data.reduce((total, item) => {
    let rate = BASE_RATE;

    if (timeCondition && timeCondition(item.hour, item.dayOfWeek)) {
      rate = BASE_RATE * (1 - discountRate / 100);
    } else if (!timeCondition) {
      rate = BASE_RATE * (1 - discountRate / 100);
    }

    return total + item.consumption * rate;
  }, 0);
};

export const calculateCustomPlanCost = (
  data: ConsumptionData[],
  plan: CustomPlan
): number => {
  return data.reduce((total, item) => {
    let rate = BASE_RATE;

    const isInTimeRange =
      plan.startHour <= plan.endHour
        ? item.hour >= plan.startHour && item.hour < plan.endHour
        : item.hour >= plan.startHour || item.hour < plan.endHour;

    const isInDayRange = plan.days.some(
      (dayId: string) => DAY_MAPPING[dayId] === item.dayOfWeek
    );

    const shouldApplyDiscount = isInTimeRange && isInDayRange;

    if (shouldApplyDiscount) {
      rate = BASE_RATE * (1 - plan.discount / 100);
    }

    return total + item.consumption * rate;
  }, 0);
};

const groupDataByMonth = (
  data: ConsumptionData[]
): Map<string, ConsumptionData[]> => {
  const monthlyData = new Map<string, ConsumptionData[]>();

  data.forEach((item) => {
    const year = item.date.getFullYear();
    const month = item.date.getMonth();
    const key = `${year}-${month.toString().padStart(2, "0")}`;

    if (!monthlyData.has(key)) {
      monthlyData.set(key, []);
    }
    monthlyData.get(key)!.push(item);
  });

  return monthlyData;
};

const getMonthName = (year: number, month: number): string => {
  return new Date(year, month).toLocaleDateString("he-IL", {
    month: "long",
    year: "numeric",
  });
};

const calculateMonthlyStats = (monthData: ConsumptionData[]) => {
  const monthlyConsumption = monthData.reduce(
    (sum, item) => sum + item.consumption,
    0
  );
  const monthlyBaseCost = monthlyConsumption * BASE_RATE;

  return { monthlyConsumption, monthlyBaseCost };
};

const getMonthInfo = (
  monthKey: string,
  monthlyData: Map<string, ConsumptionData[]>
) => {
  const monthData = monthlyData.get(monthKey)!;
  const [year, month] = monthKey.split("-").map(Number);
  const monthName = getMonthName(year, month);
  const { monthlyConsumption, monthlyBaseCost } =
    calculateMonthlyStats(monthData);

  return {
    monthData,
    year,
    month,
    monthName,
    monthlyConsumption,
    monthlyBaseCost,
  };
};

const createRegularPlan = (
  monthlyData: Map<string, ConsumptionData[]>,
  sortedMonths: string[]
): PlanResult => {
  const regularPlanBreakdown: MonthlyBreakdown[] = [];
  let regularPlanTotalCost = 0;

  sortedMonths.forEach((monthKey) => {
    const { year, month, monthName, monthlyConsumption, monthlyBaseCost } =
      getMonthInfo(monthKey, monthlyData);

    regularPlanTotalCost += monthlyBaseCost;

    regularPlanBreakdown.push({
      month: monthName,
      year,
      monthNumber: month,
      totalConsumption: monthlyConsumption,
      baseCost: monthlyBaseCost,
      plans: [],
    });
  });

  return {
    name: "תעריף רגיל",
    totalCost: regularPlanTotalCost,
    savings: 0,
    savingsPercentage: 0,
    icon: "calculator",
    description: "ללא הנחה",
    monthlyBreakdown: regularPlanBreakdown,
  };
};

const createPlanFromCustomPlan = (
  plan: CustomPlan,
  monthlyData: Map<string, ConsumptionData[]>,
  sortedMonths: string[],
  regularPlanTotalCost: number
): PlanResult => {
  const planBreakdown: MonthlyBreakdown[] = [];
  let planTotalCost = 0;

  sortedMonths.forEach((monthKey) => {
    const {
      monthData,
      year,
      month,
      monthName,
      monthlyConsumption,
      monthlyBaseCost,
    } = getMonthInfo(monthKey, monthlyData);

    const monthlyPlanCost = calculateCustomPlanCost(monthData, plan);
    planTotalCost += monthlyPlanCost;

    planBreakdown.push({
      month: monthName,
      year,
      monthNumber: month,
      totalConsumption: monthlyConsumption,
      baseCost: monthlyBaseCost,
      plans: [
        {
          name: plan.name,
          cost: monthlyPlanCost,
          savings: monthlyBaseCost - monthlyPlanCost,
          savingsPercentage:
            ((monthlyBaseCost - monthlyPlanCost) / monthlyBaseCost) * 100,
        },
      ],
    });
  });

  return {
    name: plan.name,
    totalCost: planTotalCost,
    savings: regularPlanTotalCost - planTotalCost,
    savingsPercentage:
      ((regularPlanTotalCost - planTotalCost) / regularPlanTotalCost) * 100,
    icon: plan.icon,
    description: plan.description,
    monthlyBreakdown: planBreakdown,
  };
};

const createConsumptionPlan = (
  monthlyData: Map<string, ConsumptionData[]>,
  sortedMonths: string[],
  regularPlanTotalCost: number
): PlanResult => {
  const consumptionPlanBreakdown: MonthlyBreakdown[] = [];
  let consumptionPlanTotalCost = 0;

  sortedMonths.forEach((monthKey) => {
    const { year, month, monthName, monthlyConsumption, monthlyBaseCost } =
      getMonthInfo(monthKey, monthlyData);

    let consumptionDiscountRate = 0;
    if (monthlyBaseCost <= 149) {
      consumptionDiscountRate = 0.1;
    } else if (monthlyBaseCost <= 199) {
      consumptionDiscountRate = 0.08;
    } else if (monthlyBaseCost <= 299) {
      consumptionDiscountRate = 0.06;
    } else {
      consumptionDiscountRate = 0.05;
    }

    const monthlyConsumptionPlanCost =
      monthlyBaseCost * (1 - consumptionDiscountRate);
    consumptionPlanTotalCost += monthlyConsumptionPlanCost;

    consumptionPlanBreakdown.push({
      month: monthName,
      year,
      monthNumber: month,
      totalConsumption: monthlyConsumption,
      baseCost: monthlyBaseCost,
      plans: [
        {
          name: "חשבון קטן הנחה גדולה",
          cost: monthlyConsumptionPlanCost,
          savings: monthlyBaseCost - monthlyConsumptionPlanCost,
          savingsPercentage:
            ((monthlyBaseCost - monthlyConsumptionPlanCost) / monthlyBaseCost) *
            100,
        },
      ],
    });
  });

  return {
    name: "חשבון קטן הנחה גדולה",
    totalCost: consumptionPlanTotalCost,
    savings: regularPlanTotalCost - consumptionPlanTotalCost,
    savingsPercentage:
      ((regularPlanTotalCost - consumptionPlanTotalCost) /
        regularPlanTotalCost) *
      100,
    icon: "trending-up",
    description: "הנחה לפי צריכה חודשית",
    monthlyBreakdown: consumptionPlanBreakdown,
  };
};

export const calculateResults = async (
  data: ConsumptionData[],
  customPlans?: CustomPlan[]
): Promise<PlanResult[]> => {
  if (data.length === 0) {
    throw new Error("לא נמצאו נתוני צריכה בקובץ");
  }

  const monthlyData = groupDataByMonth(data);
  const sortedMonths = Array.from(monthlyData.keys()).sort();

  const plans: PlanResult[] = [];

  const regularPlan = createRegularPlan(monthlyData, sortedMonths);
  plans.push(regularPlan);

  PREDEFINED_PLANS.forEach((plan) => {
    const planResult = createPlanFromCustomPlan(
      plan,
      monthlyData,
      sortedMonths,
      regularPlan.totalCost
    );
    plans.push(planResult);
  });

  const consumptionPlan = createConsumptionPlan(
    monthlyData,
    sortedMonths,
    regularPlan.totalCost
  );
  plans.push(consumptionPlan);

  if (customPlans && customPlans.length > 0) {
    customPlans.forEach((customPlan) => {
      const customPlanResult = createPlanFromCustomPlan(
        customPlan,
        monthlyData,
        sortedMonths,
        regularPlan.totalCost
      );
      plans.push(customPlanResult);
    });
  }

  return plans;
};

export const getBestPlan = (results: PlanResult[]): PlanResult | null => {
  if (results.length <= 1) return null;
  const plansWithSavings = results.filter((plan) => plan.savings > 0);
  if (plansWithSavings.length === 0) return null;
  return plansWithSavings.reduce((best, current) =>
    current.savings > best.savings ? current : best
  );
};
