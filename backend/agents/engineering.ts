import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

const proposalSchema = z.object({
  title: z.string().describe("A professional title for the architecture upgrade or feature."),
  description: z.string().describe("A technical description of what will be built."),
  budget: z.number().describe("The estimated cost in Indian Rupees (INR). Base this on the user's proposed budget and adjust for quality."),
  analysis: z.object({
    requirements: z.array(z.string()).describe("List of technical requirements."),
    complexity: z.enum(["Low", "Medium", "High", "Critical"]),
    timeEstimation: z.string().describe("Estimated time to complete (e.g., '3 Weeks')."),
    architectureRecommendation: z.string().describe("The recommended tech stack and architecture pattern."),
    confidenceScore: z.number().min(0).max(100).describe("Agent's confidence in this proposal out of 100."),
    knowledgeSources: z.array(z.string()).describe("Internal docs referenced, e.g. 'Engineering Handbook V3'.")
  }),
  githubIssueDraft: z.object({
    title: z.string(),
    body: z.string().describe("Markdown formatted github issue body with checkboxes for tasks.")
  })
});

export class EngineeringAgent {
  private llm: ChatOpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.llm = new ChatOpenAI({ modelName: "gpt-4o", temperature: 0.2 });
    }
  }

  async proposeImplementation(goal: string, userBudget: number = 45000) {
    console.log(`[ENGINEERING AGENT] Analyzing goal: ${goal} with user budget: ₹${userBudget}`);
    console.log(`[ENGINEERING AGENT] Performing requirement analysis and architectural design...`);
    
    if (!this.llm) {
      console.log(`[ENGINEERING AGENT] (Mock Mode) Generating fallback proposal...`);
      await new Promise(r => setTimeout(r, 1500));
      return this.getFallbackProposal(goal, userBudget);
    }

    const structuredLlm = this.llm.withStructuredOutput(proposalSchema);
    
    const response = await structuredLlm.invoke([
      new SystemMessage(`You are the Lead Enterprise Architect. 
      Generate a detailed, realistic engineering proposal, architecture recommendation, and budget estimate based on the user's goal.
      
      BUDGET & QUALITY RANGES:
      - Website Development (Standard: ₹50,000 | Range: ₹20,000 - ₹1,00,000)
      - Cloud Migration (Standard: ₹2,00,000 | Range: ₹50,000 - ₹5,00,000)
      - Mobile App (Standard: ₹1,20,000 | Range: ₹80,000 - ₹3,00,000)
      - Bug Fixing (Standard: ₹15,000 | Range: ₹5,000 - ₹30,000)
      
      RULES FOR ARCHITECTURAL PROPOSALS BASED ON USER BUDGET (₹${userBudget}):
      
      1. Website Development:
         - Low Budget (<= ₹30k): "Given the tight budget of ₹${userBudget}, we will build a basic Shopify/WordPress based E-commerce site with standard templates."
         - High Budget (>= ₹70k): "With a healthy budget of ₹${userBudget}, we will build a custom Next.js E-commerce platform with a dedicated Stripe integration, Vercel hosting, and advanced edge caching."
         
      2. Cloud Migration:
         - Low Budget (<= ₹1 Lakh): "Due to budget constraints, we will perform a 'Lift and Shift' migration to basic AWS EC2 instances with minimal refactoring."
         - High Budget (>= ₹3 Lakhs): "We will execute a fully Cloud-Native migration to AWS Elastic Kubernetes Service (EKS) with Serverless Aurora DBs and automated CI/CD pipelines."
         
      3. Mobile App:
         - Low Budget (<= ₹1 Lakh): "We will build a hybrid MVP App using Flutter/React Native with Firebase as the backend to minimize costs."
         - High Budget (>= ₹2 Lakhs): "We will build high-performance Native iOS (Swift) and Android (Kotlin) apps backed by a scalable Node.js microservices architecture."
         
      4. Bug Fixing:
         - Low Budget (<= ₹10k): "We will apply immediate hotfixes and patches to the critical bugs to restore basic stability."
         - High Budget (>= ₹20k): "We will implement a comprehensive QA automation suite, set up Sentry for advanced error tracking, and permanently resolve the root causes of system failures."

      GENERAL RULE:
      Your final budget estimate MUST NOT exceed the user's proposed budget (₹${userBudget}), unless it's impossible to build. Mold the description and requirements precisely according to the examples above based on how much the user is willing to spend.
      `),
      new HumanMessage(goal)
    ]);

    console.log(`[ENGINEERING AGENT] Proposed architecture with budget: ₹${response.budget}`);
    console.log(`[ENGINEERING AGENT] Confidence Score: ${response.analysis.confidenceScore}%`);
    return response;
  }

  async reviseBudget(proposal: any, feedback: string) {
    console.log(`[ENGINEERING AGENT] Received pushback from Finance: ${feedback}`);
    console.log(`[ENGINEERING AGENT] Revising architecture to cut costs...`);
    
    if (!this.llm) {
      console.log(`[ENGINEERING AGENT] (Mock Mode) Generating fallback revised proposal...`);
      await new Promise(r => setTimeout(r, 1500));
      return this.getFallbackRevisedProposal(proposal);
    }

    const structuredLlm = this.llm.withStructuredOutput(proposalSchema);
    
    const response = await structuredLlm.invoke([
      new SystemMessage(`You are the Lead Enterprise Architect. Your previous proposal was rejected by Finance. You must revise the architecture to significantly reduce the budget while still meeting the core requirements. Address the finance feedback directly.`),
      new HumanMessage(`Original Proposal: ${JSON.stringify(proposal)}\n\nFinance Feedback: ${feedback}`)
    ]);

    console.log(`[ENGINEERING AGENT] Revised budget down to ₹${response.budget} by scoping down infrastructure.`);
    return response;
  }

  private getFallbackProposal(goal: string, userBudget: number) {
    const isBasic = userBudget < 50000;
    
    let specificDescription = "";
    let specificTitle = "Enterprise Architecture Upgrade";
    
    if (goal.includes("Website Development")) {
      specificTitle = "E-Commerce Web Architecture";
      specificDescription = userBudget <= 30000 
        ? `Given the tight budget of ₹${userBudget}, we will build a basic Shopify/WordPress based E-commerce site with standard templates.`
        : `With a healthy budget of ₹${userBudget}, we will build a custom Next.js E-commerce platform with a dedicated Stripe integration, Vercel hosting, and advanced edge caching.`;
    } else if (goal.includes("Cloud Migration")) {
      specificTitle = "AWS Cloud Migration Strategy";
      specificDescription = userBudget <= 100000
        ? `Due to budget constraints, we will perform a 'Lift and Shift' migration to basic AWS EC2 instances with minimal refactoring.`
        : `We will execute a fully Cloud-Native migration to AWS Elastic Kubernetes Service (EKS) with Serverless Aurora DBs and automated CI/CD pipelines.`;
    } else if (goal.includes("Mobile App")) {
      specificTitle = "Mobile App Architecture";
      specificDescription = userBudget <= 100000
        ? `We will build a hybrid MVP App using Flutter/React Native with Firebase as the backend to minimize costs.`
        : `We will build high-performance Native iOS (Swift) and Android (Kotlin) apps backed by a scalable Node.js microservices architecture.`;
    } else if (goal.includes("Bug Fixing")) {
      specificTitle = "System Stability & Bug Fixes";
      specificDescription = userBudget <= 10000
        ? `We will apply immediate hotfixes and patches to the critical bugs to restore basic stability.`
        : `We will implement a comprehensive QA automation suite, set up Sentry for advanced error tracking, and permanently resolve the root causes of system failures.`;
    } else {
      specificDescription = `Technical specs to achieve: ${goal}. ${isBasic ? 'Proposing a Basic MVP setup to fit the budget.' : 'Proposing a highly scalable premium setup.'}`;
    }

    return {
      title: specificTitle,
      description: specificDescription,
      budget: userBudget, 
      analysis: {
        requirements: isBasic ? ["Basic Functionality", "Standard Hosting"] : ["High Availability", "AI Integration", "Secure Data Pipelines"],
        complexity: isBasic ? "Low" : "High",
        timeEstimation: isBasic ? "1 Week" : "3 Weeks",
        architectureRecommendation: isBasic ? "Monolith on basic VPS." : "Microservices with Kafka and Redis caching, Next.js Frontend.",
        confidenceScore: 92,
        knowledgeSources: ["Engineering Handbook V3", "AWS Well-Architected Framework"]
      },
      githubIssueDraft: {
        title: "Implement AI-Native Workflow Engine",
        body: "### Overview\nImplement scalable background processing for agents.\n### Tasks\n- [ ] Setup Infrastructure\n- [ ] Deploy Services\n- [ ] Testing"
      }
    };
  }

  private getFallbackRevisedProposal(proposal: any) {
    return {
      ...proposal,
      budget: 45000, 
      description: "Removed redundant staging environments and downgraded to spot instances to meet Finance policy limits.",
      analysis: {
        ...proposal.analysis,
        architectureRecommendation: "Monolith with PostgreSQL PubSub (reduced infrastructure).",
        confidenceScore: 85,
      }
    };
  }
}
