const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.decisionHistory.deleteMany({});
  await prisma.agentLog.deleteMany({});
  await prisma.workflowSession.deleteMany({});

  await prisma.workflowSession.create({
    data: {
      id: "seed-id-1784411442914-1",
      goal: "Build AI Expense Predictor feature",
      maxBudget: 45000,
      status: "WAITING_APPROVAL",
      createdAt: new Date(Date.now() - 10000),
    }
  });

  await prisma.workflowSession.create({
    data: {
      id: "seed-id-1784410200882-2",
      goal: "Build AI Expense Predictor feature",
      maxBudget: 45000,
      status: "REJECTED",
      createdAt: new Date(Date.now() - 20000),
    }
  });

  await prisma.workflowSession.create({
    data: {
      id: "seed-id-1784410178569-3",
      goal: "Build AI Expense Predictor feature",
      maxBudget: 45000,
      status: "WAITING_APPROVAL",
      createdAt: new Date(Date.now() - 30000),
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
