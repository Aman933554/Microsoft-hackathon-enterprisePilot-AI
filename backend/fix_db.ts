import { Client } from "@notionhq/client";
import "dotenv/config";

async function fix() {
  const notion = new Client({ auth: process.env.NOTION_FINANCE_TOKEN, notionVersion: "2022-06-28" });
  try {
    await notion.databases.update({
      database_id: process.env.NOTION_APPROVALS_DB_ID as string,
      properties: {
        "Approved": {
          checkbox: {}
        }
      }
    });
    console.log("Successfully added Approved column!");
  } catch (err: any) {
    console.error(err.message);
  }
}
fix();
