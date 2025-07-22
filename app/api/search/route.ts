import { NextResponse } from 'next/server';
import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

export async function POST(request: Request) {
  try {
    const { query, options = {} } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 });
    }

    if (!process.env.EXA_API_KEY) {
      return NextResponse.json({ error: 'EXA_API_KEY not configured' }, { status: 500 });
    }

    const searchOptions = {
      numResults: 10,
      type: 'neural', 
      contents: {
        text: true,
        highlights: true,
        summary: true
      },
      ...options
    };

      const results = await exa.search(query, searchOptions);
      console.log(results);
    
    return NextResponse.json({ 
      results: results.results,
      autopromptString: results.autopromptString,
      query: query
    });
    
  } catch (err: any) {
    console.error('Exa search error:', err);
    return NextResponse.json(
      { error: err?.message || 'Search failed' }, 
      { status: 500 }
    );
  }
}