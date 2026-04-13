import { NextRequest } from "next/server";
import anthropic from "@/lib/anthropic";
import type { TraderProfile } from "@/types/plans";

const PLAN_CONTEXT = `
TRADEIFY PLAN DATA (all prices for the listed account size):

GROWTH PLAN
- Evaluation required: YES (minimum 1 trading day)
- Profit target: 6% of account (e.g. $3,000 on $50K)
- Max trailing drawdown (EOD): $2,000 on $50K / $3,000 on $100K / $4,500 on $150K
- Daily loss limit: $1,250 on $50K / $2,500 on $100K / $3,750 on $150K
- Consistency rule during funded: 35% (no single day can exceed 35% of total profit at payout)
- No consistency rule during evaluation
- Profit split: 90/10 (trader keeps 90%)
- Payout: standard (no daily option)
- Price: $89 ($25K) / $139 ($50K) / $229 ($100K) / $329 ($150K)
- Best for: budget-conscious traders, fastest pass possible, consistent daily traders

SELECT PLAN
- Evaluation required: YES (minimum 3 trading days)
- Profit target: 5% of account (e.g. $2,500 on $50K)
- Max trailing drawdown (EOD): $2,000 on $50K / $3,000 on $100K / $4,500 on $150K
- NO daily loss limit during evaluation
- Consistency rule during evaluation only: 40% (no funded consistency rule)
- NO consistency rule when funded — unlimited upside days
- Profit split: 90/10
- Payout options: FLEX (every 5 days) or DAILY (withdraw every trading day)
- Price: $109 ($25K) / $159 ($50K) / $259 ($100K) / $359 ($150K)
- Best for: consistent traders, traders who want daily payouts, traders with occasional big days

LIGHTNING PLAN
- Evaluation required: NO — funded instantly on purchase
- No profit target
- Max trailing drawdown (EOD): $2,000 on $50K / $3,000 on $100K / $5,250 on $150K
- Daily loss limit: $1,000 on $50K / $2,000 on $100K / $3,000 on $150K
- Progressive consistency rule (funded): 20% first payout / 25% second / 30% after
- Profit split: 90/10
- Payout: standard
- Price: $349 ($25K) / $469 ($50K) / $659 ($100K) / $759 ($150K)
- Best for: traders who want to skip evaluation entirely, experienced traders, those who can't wait
`;

function buildUserMessage(profile: TraderProfile): string {
  const experienceMap: Record<string, string> = {
    lt6months: "Less than 6 months",
    "6to12months": "6-12 months",
    "1to2years": "1-2 years",
    "2plus": "2+ years",
  };
  const styleMap: Record<string, string> = {
    scalper: "Scalper (many quick trades, tight stops)",
    daytrader: "Day trader (a few high-conviction setups per day)",
    swing: "Swing-ish (holds positions for hours, bigger moves)",
  };
  const riskMap: Record<string, string> = {
    cutfast: "Cuts losses fast (small stops)",
    givesroom: "Gives trades room to breathe (wider stops)",
    inbetween: "Somewhere in between",
  };
  const consistencyMap: Record<string, string> = {
    veryconsistent: "Very consistent (similar P&L most days)",
    moderate: "Moderate (some bigger days, some smaller)",
    inconsistent: "Inconsistent (a few big wins carry the month)",
  };
  const speedMap: Record<string, string> = {
    asap: "ASAP — wants to skip evaluation and start funded immediately",
    canwait: "Can wait a few days (fine with a short evaluation)",
    patient: "Patient — lowest cost matters most",
  };
  const payoutMap: Record<string, string> = {
    daily: "Daily withdrawals",
    every5days: "Every 5 days",
    flexible: "Flexible — payout timing doesn't matter",
  };

  return `TRADER PROFILE:
- Experience: ${experienceMap[profile.experience]}
- Trading style: ${styleMap[profile.style]}
- Risk tolerance: ${riskMap[profile.riskTolerance]}
- Result consistency: ${consistencyMap[profile.consistency]}
- Speed priority: ${speedMap[profile.speedPriority]}
- Target account size: $${profile.capitalGoal.replace("k", ",000")}
- Payout preference: ${payoutMap[profile.payoutPreference]}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { profile: TraderProfile };
    const { profile } = body;

    if (!profile) {
      return Response.json({ error: "Missing trader profile" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: `You are an expert advisor for Tradeify, a futures proprietary trading firm. Given the trader profile and plan data below, recommend the best Tradeify plan (Growth, Select, or Lightning).

Also recommend the best account size and, if Select, whether Flex or Daily payout is better for them.

Be direct and specific. Explain the tradeoffs clearly. Keep reasoning under 150 words.

You MUST respond with ONLY valid JSON in this exact format, no other text:
{
  "recommendedPlan": "Growth" | "Select" | "Lightning",
  "accountSize": "$50K" | "$25K" | "$100K" | "$150K",
  "payoutPath": "Flex" | "Daily" | null,
  "reasoning": "string",
  "warnings": ["string"],
  "nextSteps": ["string", "string", "string"]
}

Rules:
- payoutPath must be "Flex" or "Daily" only if recommendedPlan is "Select", otherwise null
- warnings should be 1-3 specific risks or watch-outs for this trader with this plan
- nextSteps should be exactly 3 actionable items

${PLAN_CONTEXT}`,
      messages: [
        {
          role: "user",
          content: buildUserMessage(profile),
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return Response.json({ error: "Unexpected response type" }, { status: 500 });
    }

    // Strip any markdown code fences if Claude wraps the JSON
    const raw = content.text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");

    const recommendation = JSON.parse(raw) as {
      recommendedPlan: string;
      accountSize: string;
      payoutPath: string | null;
      reasoning: string;
      warnings: string[];
      nextSteps: string[];
    };

    return Response.json({ recommendation });
  } catch (err) {
    console.error("Recommendation error:", err);
    return Response.json(
      { error: "Failed to generate recommendation. Please try again." },
      { status: 500 }
    );
  }
}
