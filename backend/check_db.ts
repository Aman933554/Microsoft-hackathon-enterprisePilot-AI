import { Client } from "@notionhq/client";
import "dotenv/config";

async function check() {
  const notion = new Client({ auth: process.env.NOTION_FINANCE_TOKEN });
  try {
    const db = await notion.databases.retrieve({ database_id: "39ea8df9-29ad-809b-8dfe-000b3a11a5f4" });
    console.log(JSON.stringify(db, null, 2));
  } catch(err: any) {
    console.error("ERROR:", err.message);
  }
}
check();
