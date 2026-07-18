import { Client } from "@notionhq/client";
import "dotenv/config";

async function run() {
  const notion = new Client({ auth: process.env.NOTION_FINANCE_TOKEN });
  try {
    const response = await notion.search({});
    console.log("Finance Agent sees " + response.results.length + " objects.");
    
    response.results.forEach((obj: any) => {
      let title = "Unknown";
      if (obj.object === "database") {
        title = obj.title?.[0]?.plain_text || "Untitled DB";
      } else if (obj.object === "page") {
        for (const key in obj.properties) {
          if (obj.properties[key].type === "title") {
            title = obj.properties[key].title?.[0]?.plain_text || "Untitled Page";
          }
        }
      }
      console.log(`[${obj.object.toUpperCase()}] ${title} (ID: ${obj.id})`);
    });
  } catch (err: any) {
    console.error("FAILED:", err.message);
  }
}
run();
