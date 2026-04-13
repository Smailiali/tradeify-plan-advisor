import type { Plan, PlanData, DrawdownDay, ConsistencyDay } from "@/types/plans";

// ---------------------------------------------------------------------------
// Plan data for all account sizes
// ---------------------------------------------------------------------------

const growth25k: Plan = {
  name: "Growth",
  price: 89,
  evaluationRequired: true,
  minDaysToPass: 1,
  profitTarget: 1500,
  maxDrawdown: 1500,
  dailyLossLimit: 625,
  consistencyRuleEval: null,
  consistencyRuleFunded: 35,
  progressiveConsistency: false,
  progressiveSteps: null,
  payoutOptions: [null],
  profitSplit: 90,
  accountSize: "25k",
  bestFor: "Budget-conscious traders who want fast evaluation",
  accentColor: "green",
};

const select25k: Plan = {
  name: "Select",
  price: 109,
  evaluationRequired: true,
  minDaysToPass: 3,
  profitTarget: 1250,
  maxDrawdown: 1500,
  dailyLossLimit: null,
  consistencyRuleEval: 40,
  consistencyRuleFunded: null,
  progressiveConsistency: false,
  progressiveSteps: null,
  payoutOptions: ["Flex", "Daily"],
  profitSplit: 90,
  accountSize: "25k",
  bestFor: "Consistent traders who want flexible payout options",
  accentColor: "blue",
};

const lightning25k: Plan = {
  name: "Lightning",
  price: 349,
  evaluationRequired: false,
  minDaysToPass: null,
  profitTarget: null,
  maxDrawdown: 1500,
  dailyLossLimit: 500,
  consistencyRuleEval: null,
  consistencyRuleFunded: null,
  progressiveConsistency: true,
  progressiveSteps: [20, 25, 30],
  payoutOptions: [null],
  profitSplit: 90,
  accountSize: "25k",
  bestFor: "Traders who want to start funded immediately",
  accentColor: "amber",
};

const growth50k: Plan = {
  name: "Growth",
  price: 139,
  evaluationRequired: true,
  minDaysToPass: 1,
  profitTarget: 3000,
  maxDrawdown: 2000,
  dailyLossLimit: 1250,
  consistencyRuleEval: null,
  consistencyRuleFunded: 35,
  progressiveConsistency: false,
  progressiveSteps: null,
  payoutOptions: [null],
  profitSplit: 90,
  accountSize: "50k",
  bestFor: "Budget-conscious traders who want fast evaluation",
  accentColor: "green",
};

const select50k: Plan = {
  name: "Select",
  price: 159,
  evaluationRequired: true,
  minDaysToPass: 3,
  profitTarget: 2500,
  maxDrawdown: 2000,
  dailyLossLimit: null,
  consistencyRuleEval: 40,
  consistencyRuleFunded: null,
  progressiveConsistency: false,
  progressiveSteps: null,
  payoutOptions: ["Flex", "Daily"],
  profitSplit: 90,
  accountSize: "50k",
  bestFor: "Consistent traders who want flexible payout options",
  accentColor: "blue",
};

const lightning50k: Plan = {
  name: "Lightning",
  price: 469,
  evaluationRequired: false,
  minDaysToPass: null,
  profitTarget: null,
  maxDrawdown: 2000,
  dailyLossLimit: 1000,
  consistencyRuleEval: null,
  consistencyRuleFunded: null,
  progressiveConsistency: true,
  progressiveSteps: [20, 25, 30],
  payoutOptions: [null],
  profitSplit: 90,
  accountSize: "50k",
  bestFor: "Traders who want to start funded immediately",
  accentColor: "amber",
};

const growth100k: Plan = {
  name: "Growth",
  price: 229,
  evaluationRequired: true,
  minDaysToPass: 1,
  profitTarget: 6000,
  maxDrawdown: 3000,
  dailyLossLimit: 2500,
  consistencyRuleEval: null,
  consistencyRuleFunded: 35,
  progressiveConsistency: false,
  progressiveSteps: null,
  payoutOptions: [null],
  profitSplit: 90,
  accountSize: "100k",
  bestFor: "Budget-conscious traders who want fast evaluation",
  accentColor: "green",
};

const select100k: Plan = {
  name: "Select",
  price: 259,
  evaluationRequired: true,
  minDaysToPass: 3,
  profitTarget: 5000,
  maxDrawdown: 3000,
  dailyLossLimit: null,
  consistencyRuleEval: 40,
  consistencyRuleFunded: null,
  progressiveConsistency: false,
  progressiveSteps: null,
  payoutOptions: ["Flex", "Daily"],
  profitSplit: 90,
  accountSize: "100k",
  bestFor: "Consistent traders who want flexible payout options",
  accentColor: "blue",
};

const lightning100k: Plan = {
  name: "Lightning",
  price: 659,
  evaluationRequired: false,
  minDaysToPass: null,
  profitTarget: null,
  maxDrawdown: 3000,
  dailyLossLimit: 2000,
  consistencyRuleEval: null,
  consistencyRuleFunded: null,
  progressiveConsistency: true,
  progressiveSteps: [20, 25, 30],
  payoutOptions: [null],
  profitSplit: 90,
  accountSize: "100k",
  bestFor: "Traders who want to start funded immediately",
  accentColor: "amber",
};

const growth150k: Plan = {
  name: "Growth",
  price: 329,
  evaluationRequired: true,
  minDaysToPass: 1,
  profitTarget: 9000,
  maxDrawdown: 4500,
  dailyLossLimit: 3750,
  consistencyRuleEval: null,
  consistencyRuleFunded: 35,
  progressiveConsistency: false,
  progressiveSteps: null,
  payoutOptions: [null],
  profitSplit: 90,
  accountSize: "150k",
  bestFor: "Budget-conscious traders who want fast evaluation",
  accentColor: "green",
};

const select150k: Plan = {
  name: "Select",
  price: 359,
  evaluationRequired: true,
  minDaysToPass: 3,
  profitTarget: 7500,
  maxDrawdown: 4500,
  dailyLossLimit: null,
  consistencyRuleEval: 40,
  consistencyRuleFunded: null,
  progressiveConsistency: false,
  progressiveSteps: null,
  payoutOptions: ["Flex", "Daily"],
  profitSplit: 90,
  accountSize: "150k",
  bestFor: "Consistent traders who want flexible payout options",
  accentColor: "blue",
};

const lightning150k: Plan = {
  name: "Lightning",
  price: 759,
  evaluationRequired: false,
  minDaysToPass: null,
  profitTarget: null,
  maxDrawdown: 5250,
  dailyLossLimit: 3000,
  consistencyRuleEval: null,
  consistencyRuleFunded: null,
  progressiveConsistency: true,
  progressiveSteps: [20, 25, 30],
  payoutOptions: [null],
  profitSplit: 90,
  accountSize: "150k",
  bestFor: "Traders who want to start funded immediately",
  accentColor: "amber",
};

export const planData: PlanData = {
  "25k": [growth25k, select25k, lightning25k],
  "50k": [growth50k, select50k, lightning50k],
  "100k": [growth100k, select100k, lightning100k],
  "150k": [growth150k, select150k, lightning150k],
};

// ---------------------------------------------------------------------------
// Drawdown visualizer mock data ($50K account, $2,000 drawdown)
// EOD trailing drawdown — locks when balance > starting capital + drawdown + $100
// Lock threshold: $50,000 + $2,000 + $100 = $52,100
// ---------------------------------------------------------------------------

export const drawdownData: DrawdownDay[] = [
  {
    day: 1,
    startBalance: 50000,
    endBalance: 50450,
    drawdownFloor: 48450,
    locked: false,
    annotation: "Drawdown trails up",
  },
  {
    day: 2,
    startBalance: 50450,
    endBalance: 50900,
    drawdownFloor: 48900,
    locked: false,
    annotation: "Drawdown trails up",
  },
  {
    day: 3,
    startBalance: 50900,
    endBalance: 50600,
    drawdownFloor: 48900,
    locked: false,
    annotation: "Balance dropped, floor holds",
  },
  {
    day: 4,
    startBalance: 50600,
    endBalance: 51200,
    drawdownFloor: 49200,
    locked: false,
    annotation: "Drawdown trails up",
  },
  {
    day: 5,
    startBalance: 51200,
    endBalance: 51800,
    drawdownFloor: 49800,
    locked: false,
    annotation: "Drawdown trails up",
  },
  {
    day: 6,
    startBalance: 51800,
    endBalance: 52150,
    drawdownFloor: 50100,
    locked: true,
    annotation: "Drawdown locks here",
  },
  {
    day: 7,
    startBalance: 52150,
    endBalance: 51700,
    drawdownFloor: 50100,
    locked: true,
    annotation: "Safe zone",
  },
  {
    day: 8,
    startBalance: 51700,
    endBalance: 52400,
    drawdownFloor: 50100,
    locked: true,
    annotation: "Safe zone",
  },
  {
    day: 9,
    startBalance: 52400,
    endBalance: 51900,
    drawdownFloor: 50100,
    locked: true,
    annotation: "Safe zone",
  },
  {
    day: 10,
    startBalance: 51900,
    endBalance: 53100,
    drawdownFloor: 50100,
    locked: true,
    annotation: "Safe zone",
  },
];

// ---------------------------------------------------------------------------
// Consistency checker default example data
// Pre-populated with one violation to make the tool educational
// ---------------------------------------------------------------------------

export const defaultConsistencyDays: ConsistencyDay[] = [
  { day: 1, pnl: 320 },
  { day: 2, pnl: 480 },
  { day: 3, pnl: 800 }, // violates 35% rule on its own against this total
  { day: 4, pnl: 210 },
  { day: 5, pnl: 290 },
];
