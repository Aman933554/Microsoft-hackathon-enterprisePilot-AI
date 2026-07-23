import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

const financeReviewSchema = z.object({
  approved: z.boolean().describe("Whether the budget is approved or rejected based on the policy."),
  feedback: z.string().optional().describe("If rejected, provide polite but firm feedback explaining the policy violation and requesting a budget reduction."),
  analysis: z.object({
    roiCalculation: z.string().describe("Estimated Return on Investment over 12 months."),
    policyValidation: z.string().describe("Explanation of how it passes or fails specific capital allocation limits."),
    negotiationHistory: z.array(z.object({
      agent: z.string(),
      message: z.string()
    })).describe("The history of this negotiation."),
    alternativeBudgetSuggestions: z.array(z.object({
      suggestion: z.number(),
      rationale: z.string()
    })).describe("Alternative budget numbers the engineering team should aim for.")
  })
});

export class FinanceAgent {
  private llm: ChatOpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.llm = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0 });
    }
  }

  async reviewBudget(budget: number, maxBudget: number, goal: string = "", proposalDetails: any = {}) {
    
    if (!this.llm) {
      console.log(`[FINANCE AGENT] (Mock Mode) Falling back to hardcoded logic...`);
      let isApproved = budget <= maxBudget;
      let feedback = `Budget of ₹${budget} exceeds our policy limit of ₹${maxBudget}. Please reduce the budget. Recommend exploring spot instances.`;
      
      // Dynamic Mock check based on feature type
      if (goal.includes("Mobile App") && maxBudget < 80000) {
        isApproved = false;
        feedback = `The budget of ₹${maxBudget} is too low for Mobile App Development. Minimum required is ₹80,000.`;
      } else if (goal.includes("Cloud Migration") && maxBudget < 50000) {
        isApproved = false;
        feedback = `The budget of ₹${maxBudget} is too low for Cloud Migration. Minimum required is ₹50,000.`;
      } else if (goal.includes("Website") && maxBudget < 20000) {
        isApproved = false;
        feedback = `The budget of ₹${maxBudget} is too low for Website Development. Minimum required is ₹20,000.`;
      }

      const analysis = {
        roiCalculation: "2.4x over 12 months (Estimated)",
        policyValidation: isApproved ? "Passes standard tech infrastructure limits." : "Fails minimum budget policy limits.",
        negotiationHistory: isApproved ? [] : [{ agent: "Finance", message: feedback }],
        alternativeBudgetSuggestions: isApproved ? [] : [{ suggestion: maxBudget < 20000 ? 50000 : maxBudget, rationale: "Required to maintain standard quality." }]
      };
      
      if (isApproved) {
        console.log(`[FINANCE AGENT] Budget of ₹${budget} is within policy (<= ₹${maxBudget}). Approved.`);
        return { approved: true, analysis };
      } else {
        console.log(`[FINANCE AGENT] Rejected: ${feedback}`);
        return { approved: false, feedback, analysis };
      }
    }

    const structuredLlm = this.llm.withStructuredOutput(financeReviewSchema);

    const systemPrompt = `You are the Chief Financial Officer (CFO) AI Agent. 
    You must review the Engineering Agent's proposal and budget for: ${goal}
    
    The user's maximum budget is ₹${maxBudget}.
    
    BUDGET RANGES BY PRODUCT:
    - Website Development (Range: ₹20,000 - ₹1,00,000)
    - Cloud Migration (Range: ₹50,000 - ₹5,00,000)
    - Mobile App (Range: ₹80,000 - ₹3,00,000)
    - Bug Fixing (Range: ₹5,000 - ₹30,000)

    RULES:
    1. If the Engineering requested budget (₹${budget}) exceeds the user max budget (₹${maxBudget}), REJECT IT.
    2. If the user's max budget is completely unreasonable for the product type (e.g. asking for a Mobile App for ₹10,000, which is below the ₹80k minimum), REJECT IT with feedback stating the budget is too low for this product category.
    3. If everything is within reasonable limits and <= maxBudget, APPROVE it.`;

    const response = await structuredLlm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Engineering requested: ₹${budget}\nProposal Details: ${JSON.stringify(proposalDetails)}`)
    ]);

    if (response.approved) {
      console.log(`[FINANCE AGENT] Budget of ₹${budget} is within policy. Approved.`);
    } else {
      console.log(`[FINANCE AGENT] Rejected: ${response.feedback}`);
    }

    return response;
  }
}
