import { NextResponse } from 'next/server';
import { runDemo } from '../../../../../backend/run-graph';
import { evaluateBudget } from '../../../../../backend/ai/budgetEvaluator';

export const maxDuration = 300; // Allow Vercel/Next to run this for up to 5 mins

export async function POST(req: Request) {
  try {
    const { goal, maxBudget } = await req.json();
    
    // Auto-evaluate and decide final budget
    const evaluation = evaluateBudget(
      goal || "Build a new scalable messaging queue for microservices.", 
      maxBudget || 50000
    );

    const result = await runDemo(
      goal || "Build a new scalable messaging queue for microservices.", 
      evaluation.finalDecidedBudget
    );
    
    // Inject the budget evaluator reasoning as a system log so frontend can parse it
    if (result.logs) {
      result.logs.unshift(`[SYSTEM] ${evaluation.aiReasoning}`);
    }

    return NextResponse.json({ 
      success: true, 
      ...result,
      budgetEvaluation: evaluation 
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
