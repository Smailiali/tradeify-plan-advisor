export type AccountSize = "25k" | "50k" | "100k" | "150k";

export type PlanName = "Growth" | "Select" | "Lightning";

export type PayoutPath = "Flex" | "Daily" | null;

export interface Plan {
  name: PlanName;
  price: number;
  evaluationRequired: boolean;
  minDaysToPass: number | null; // null = instant (Lightning)
  profitTarget: number | null;  // null = no target (Lightning)
  maxDrawdown: number;
  dailyLossLimit: number | null; // null = no DLL
  consistencyRuleEval: number | null;  // percentage, null = no rule
  consistencyRuleFunded: number | null; // percentage, null = no rule
  progressiveConsistency: boolean; // true for Lightning
  progressiveSteps: number[] | null; // e.g. [20, 25, 30] for Lightning
  payoutOptions: PayoutPath[];
  profitSplit: number; // percentage trader receives (e.g. 90)
  accountSize: AccountSize;
  bestFor: string;
  accentColor: "green" | "blue" | "amber";
}

export interface PlanData {
  "25k": Plan[];
  "50k": Plan[];
  "100k": Plan[];
  "150k": Plan[];
}

export interface TraderProfile {
  experience: "lt6months" | "6to12months" | "1to2years" | "2plus";
  style: "scalper" | "daytrader" | "swing";
  riskTolerance: "cutfast" | "givesroom" | "inbetween";
  consistency: "veryconsistent" | "moderate" | "inconsistent";
  speedPriority: "asap" | "canwait" | "patient";
  capitalGoal: AccountSize;
  payoutPreference: "daily" | "every5days" | "flexible";
}

export interface Recommendation {
  recommendedPlan: PlanName;
  accountSize: string;
  payoutPath: PayoutPath;
  reasoning: string;
  warnings: string[];
  nextSteps: string[];
}

export interface ROIInputs {
  avgDailyProfit: number;
  tradingDaysPerWeek: number;
  winRate: number;         // 0–1
  avgLossPerLosingDay: number;
}

export interface ROIResult {
  plan: Plan;
  weeklyNetProfit: number;
  monthlyNetProfit: number;
  breakevenWeeks: number;
  threeMonthEarnings: number;
  totalROIPercent: number;
}

export interface DrawdownDay {
  day: number;
  startBalance: number;
  endBalance: number;
  drawdownFloor: number;
  locked: boolean;
  annotation?: string;
}

export interface ConsistencyDay {
  day: number;
  pnl: number;
}

export interface ConsistencyResult {
  days: Array<ConsistencyDay & { percentage: number; violates: boolean }>;
  totalProfit: number;
  passes: boolean;
  violatingDays: number[];
  requiredTotalForPass: number | null;
}
