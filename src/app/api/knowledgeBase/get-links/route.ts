// app/api/get-links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const links: string[] = [];

    $('a').each((_, el) => {
      let href = $(el).attr('href');
      if (!href) return;

      try {
        href = new URL(href, url).href;
      } catch {
        return;
      }

      // Only include links from the same domain
      if (href.startsWith(url)) {
        links.push(href);
      }
    });

    const uniqueLinks = [...new Set(links)];

    return NextResponse.json({ links: uniqueLinks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch or parse the URL' }, { status: 500 });
  }
}
