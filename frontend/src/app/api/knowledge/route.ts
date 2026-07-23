import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let articles = await prisma.knowledgeArticle.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Seed default articles if DB is empty to look good for hackathon
    if (articles.length === 0) {
      const defaultArticles = [
        { title: "Q3 Enterprise Budget Constraints", category: "Finance Policy", tags: "budget, constraints, q3", content: "Max budget is 45000." },
        { title: "SOC2 Compliance Guidelines", category: "Security", tags: "soc2, security, compliance", content: "All data must be encrypted." },
        { title: "React/Next.js Architecture Patterns", category: "Engineering", tags: "react, nextjs, architecture", content: "Use App Router." },
        { title: "Customer Escalation Workflow", category: "Support", tags: "support, escalation, customer", content: "Escalate to tier 2 if unresolved in 1hr." },
      ];

      for (const art of defaultArticles) {
        await prisma.knowledgeArticle.create({ data: art });
      }
      
      articles = await prisma.knowledgeArticle.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ success: true, articles });
  } catch (error: any) {
    console.error("API Error (Knowledge):", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newArticle = await prisma.knowledgeArticle.create({
      data: {
        title: data.title,
        category: data.category,
        tags: data.tags,
        content: data.content,
      }
    });
    return NextResponse.json({ success: true, article: newArticle });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
