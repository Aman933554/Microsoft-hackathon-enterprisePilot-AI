import { Client } from "@notionhq/client";
import "dotenv/config";

async function createDatabase() {
  const notion = new Client({ auth: process.env.NOTION_FINANCE_TOKEN });
  try {
    console.log("Creating Database...");
    const db = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: "39ea8df929ad80e8abb0db9b8b45a5dc", // The page they shared with the Finance Agent
      },
      title: [
        {
          type: "text",
          text: { content: "Approvals (Auto-Created by AI)" },
        },
      ],
      properties: {
        "Name": { title: {} },
        "Budget": { number: { format: "number" } },
        "Approved": { checkbox: {} },
      },
    });
    console.log("SUCCESS! Database ID:", db.id);
  } catch (err: any) {
    console.error("FAILED:", err.message);
  }
}

createDatabase();
