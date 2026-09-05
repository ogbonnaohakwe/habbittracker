import { NextResponse } from 'next/server';
import { HabitLocalStore } from '@/lib/mockStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const habits = HabitLocalStore.getHabits().filter(h => !h.archived);
    return NextResponse.json(habits);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, category } = await request.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Habit name is required' }, { status: 400 });
    }

    const result = HabitLocalStore.createHabit(name, category);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.habit, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
