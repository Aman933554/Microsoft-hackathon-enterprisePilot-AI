import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!process.env.NOTION_TOKEN) {
       return NextResponse.json({ success: false, error: 'NOTION_TOKEN not set' }, { status: 400 });
    }
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    
    // Fetch explicit databases using the env variables to avoid search pagination issues
    const dbIds = [
      process.env.NOTION_CAMPAIGNS_DB_ID,
      process.env.NOTION_APPROVALS_DB_ID
    ].filter(Boolean);

    // Remove duplicates if both point to the same DB for some reason
    const uniqueDbIds = Array.from(new Set(dbIds));

    const databasesList = [];
    for (const id of uniqueDbIds) {
      if (id) {
        try {
          const db = await notion.databases.retrieve({ database_id: id });
          databasesList.push(db);
        } catch (e: any) {
          // If the integration doesn't have access to this specific DB yet, just skip it
          console.error(`Could not retrieve DB ${id}:`, e.message);
        }
      }
    }

    const databases = databasesList.map((db: any) => {
      // Find title
      let title = "Untitled Database";
      if (db.title && db.title.length > 0) {
        title = db.title.map((t: any) => t.plain_text).join("");
      }
      
      return {
        id: db.id,
        name: title,
        access: "Read/Write", 
        lastSynced: "Just now",
        url: db.url
      };
    });

    return NextResponse.json({ success: true, databases });
  } catch (error: any) {
    console.error("Notion API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
