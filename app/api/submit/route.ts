import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const { error } = await supabase
      .from('responses')
      .insert({ data });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Error saving response:', err);
    return NextResponse.json({ ok: false, error: 'Error al guardar' }, { status: 500 });
  }
}
