import { Client } from "@notionhq/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../../../../frontend/.env") });

async function debugNotion() {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN, notionVersion: "2025-09-03" });
    
    console.log("Token:", process.env.NOTION_TOKEN?.substring(0, 10) + "...");
    
    // 1. Try search API
    console.log("\n--- Running Search ---");
    const searchRes = await notion.search({
      filter: { property: 'object', value: 'database' } as any
    });
    console.log(`Found ${searchRes.results.length} items in search.`);
    for (const res of searchRes.results) {
      console.log(`- ID: ${res.id}, Object: ${res.object}`);
    }

    // 2. Try retrieving the specific database
    const dbId = process.env.NOTION_APPROVALS_DB_ID;
    console.log(`\n--- Retrieving DB ${dbId} ---`);
    if (dbId) {
      try {
        const dbRes = await notion.databases.retrieve({ database_id: dbId });
        console.log("Successfully retrieved DB:");
        console.log("Title:", (dbRes as any).title?.[0]?.plain_text);
      } catch (err: any) {
        console.error("Failed to retrieve DB:", err.message);
      }
    }
  } catch (err: any) {
    console.error("Fatal Error:", err.message);
  }
}

debugNotion();
