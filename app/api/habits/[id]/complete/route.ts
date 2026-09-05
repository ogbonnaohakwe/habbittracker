import { NextResponse } from 'next/server';
import { HabitLocalStore } from '@/lib/mockStore';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { habit } = HabitLocalStore.toggleHabitComplete(id);
    return NextResponse.json({
      id: habit.id,
      name: habit.name,
      streak_count: habit.streak_count,
      is_completed_today: habit.is_completed_today,
      last_completed_at: habit.last_completed_at,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
