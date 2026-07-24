import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const databaseId = searchParams.get('id');

    if (!databaseId) {
       return NextResponse.json({ success: false, error: 'Database ID is required' }, { status: 400 });
    }

    if (!process.env.NOTION_TOKEN) {
       return NextResponse.json({ success: false, error: 'NOTION_TOKEN not set' }, { status: 400 });
    }

    // Query the database directly via HTTP to bypass broken SDK method
    const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page_size: 100 })
    });
    
    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Notion API returned ${res.status}: ${errBody}`);
    }
    
    const response = await res.json();

    // Format the data nicely
    const rows = response.results.map((page: any) => {
      const formattedRow: any = { id: page.id };
      
      if (page.properties) {
        Object.entries(page.properties).forEach(([key, prop]: [string, any]) => {
          let value = "";
          switch (prop.type) {
            case 'title':
            case 'rich_text':
              value = prop[prop.type].map((t: any) => t.plain_text).join("");
              break;
            case 'select':
              value = prop.select?.name || "";
              break;
            case 'multi_select':
              value = prop.multi_select.map((s: any) => s.name).join(", ");
              break;
            case 'checkbox':
              value = prop.checkbox ? "Yes" : "No";
              break;
            case 'date':
              value = prop.date?.start || "";
              break;
            case 'url':
              value = prop.url || "";
              break;
            case 'number':
              value = prop.number !== null ? String(prop.number) : "";
              break;
            case 'status':
              value = prop.status?.name || "";
              break;
            default:
              value = "[Unsupported Type]";
          }
          formattedRow[key] = value;
        });
      }
      return formattedRow;
    });

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Notion Data API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
