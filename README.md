# 🚀 AI-Native Enterprise Operating System

Welcome to the future of enterprise automation.

## 🌟 The Vision
In the future, human workers won't execute tasks; they will **manage, orchestrate, and approve** tasks executed by specialized AI agents. This project demonstrates an AI-Native Enterprise Operating System where Marketing and Finance AI agents autonomously negotiate campaigns, but seamlessly pause to request **real human approval** via Notion before executing financial actions.

---

## 📖 The Story: Normal Company vs AI Company

### ❌ Normal Company (Without AI)
In a traditional setup, every step requires human intervention, leading to massive delays.

1. **Customer** tells **Sales** they need a new feature.
2. **Sales** sends an email to **Engineering**.
3. **Engineering** reads the email, creates an estimate (Time = 5 Days, Cost = ₹40,000), and emails **Finance**.
4. **Finance** reviews the budget and replies (Approved / Rejected).
5. **Manager** receives an email for final approval (YES / NO).
6. **Engineering** finally starts coding.

**The Problem:** Engineering → Email, Finance → Email, Manager → Email, Slack → Notification, GitHub → Manual Issue. *Humans are the bottleneck everywhere. Time is wasted.*

### ✅ The AI Company (Our Approach)
Imagine a company where AI acts as the employees, and humans only act as the final decision-makers.

- 🤖 **Engineering/Marketing AI**
- 🤖 **Finance AI**
- 👨 **Manager (Human)**

1. **Customer** requests a new feature.
2. **Engineering AI** instantly understands, estimates time/cost, and *autonomously* messages **Finance AI**. *(Zero human effort)*
3. **Finance AI** checks the budget. If it's too high, **Engineering AI** negotiates and adjusts automatically. *(Zero human effort)*
4. The *only* time a human is involved is at the end: **Manager clicks "Approve" on their phone/email**.
5. After approval, the AI *automatically* creates GitHub Issues, sends Slack notifications, and saves the logs in Notion.

**Everything is automatic, instantly connected, and frictionless.**

---

## 🏆 Hackathon Winning Features

### 1. True Human-in-the-Loop (Decoupled Pausing)
Unlike simple demos that use hardcoded delays, this orchestrator uses `interruptBefore` in LangGraph. The execution thread **entirely halts** and waits asynchronously. A user must trigger a webhook (via the frontend UI or terminal) to resume the exact thread state.

### 2. Multi-Agent Negotiation
- **Marketing Agent:** Generates creative campaigns and proposes budgets based on user goals.
- **Finance Agent:** Enforces strict financial policies. If Marketing exceeds the limit, Finance rejects the proposal, forcing Marketing to revise its budget autonomously until compliance is reached.

### 3. Ultimate Traceability (Durable Design)
When agents act, they write human-readable logs directly into **Notion Pages** as text blocks (Rationale and Feedback). If a new team member joins next week, they can look at Notion and understand *exactly* why a budget was approved or rejected by the AI.

### 4. Real Access Control
Agents are restricted by design. The Marketing agent only has API access to the Campaigns database, and the Finance agent only has access to the Approvals database. This prevents rogue agent behavior at the infrastructure level.

## 🛠️ How to Run

### Option 1: Premium Frontend UI (Next.js)
Experience the visual graph and real-time terminal logs.
```bash
npm run dev
```
1. Open `http://localhost:3000`
2. Configure your custom Goal and Finance Policy limit.
3. Launch the workflow and watch the agents negotiate live!
4. **Approve via Webhook** when the UI pauses.

### Option 2: Interactive Terminal (CLI)
Run the premium CLI script for a hacker-friendly interface.
```bash
npx tsx src/index.ts
```
1. Answer the dynamic prompts to set your campaign goal and budget policy.
2. Watch the colorized output as the LangGraph state progresses.
3. Type `approve` when prompted to resume the paused thread!

## 🔧 Technologies Used
- **LangGraph & LangChain:** Core orchestration and state management.
- **OpenAI:** LLM reasoning engines.
- **Notion API:** Durable logging and human-in-the-loop dashboard.
- **Next.js & Framer Motion:** Beautiful, reactive frontend UI.
- **Slack API:** Final execution notifications.
