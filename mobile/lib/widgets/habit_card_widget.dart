import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/habit.dart';
import '../theme/app_theme.dart';

class HabitCardWidget extends StatelessWidget {
  final Habit habit;
  final VoidCallback onToggle;
  final VoidCallback onDelete;

  const HabitCardWidget({
    super.key,
    required this.habit,
    required this.onToggle,
    required this.onDelete,
  });

  IconData _getCategoryIcon() {
    final nameLower = habit.name.toLowerCase();
    if (nameLower.contains('water') || nameLower.contains('drink')) {
      return Icons.water_drop_rounded;
    }
    if (nameLower.contains('read') || nameLower.contains('book')) {
      return Icons.menu_book_rounded;
    }
    if (nameLower.contains('workout') || nameLower.contains('exercise')) {
      return Icons.fitness_center_rounded;
    }
    return Icons.auto_awesome_rounded;
  }

  @override
  Widget build(BuildContext context) {
    final isDone = habit.isCompletedToday;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      margin: const EdgeInsets.only(bottom: 12.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: AppTheme.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(
          color: isDone ? AppTheme.primaryContainer : Colors.transparent,
          width: isDone ? 1.0 : 0.0,
        ),
        boxShadow: isDone
            ? []
            : [
                BoxShadow(
                  color: const Color(0xFF1E293B).withOpacity(0.05),
                  blurRadius: 20.0,
                  offset: const Offset(0, 4),
                ),
              ],
      ),
      child: Row(
        children: [
          // Left Icon Container (Stitch Spec: bg-secondary-container/30 or bg-primary-container/20)
          Opacity(
            opacity: isDone ? 0.8 : 1.0,
            child: Container(
              padding: const EdgeInsets.all(10.0),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDone
                    ? AppTheme.primaryContainer.withOpacity(0.2)
                    : AppTheme.secondaryContainer.withOpacity(0.3),
              ),
              child: Icon(
                _getCategoryIcon(),
                color: AppTheme.primary,
                size: 24,
              ),
            ),
          ),

          const SizedBox(width: 14.0),

          // Habit Title & Streak Count
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  habit.name,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 18,
                    fontWeight: isDone ? FontWeight.w400 : FontWeight.w600,
                    color: isDone ? AppTheme.onSurfaceVariant : AppTheme.onSurface,
                    decoration: isDone ? TextDecoration.lineThrough : null,
                  ),
                ),
                const SizedBox(height: 4.0),
                Row(
                  children: [
                    const Icon(
                      Icons.local_fire_department_rounded,
                      color: AppTheme.flameColor,
                      size: 16,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${habit.streakCount} Day Streak${isDone ? '!' : ''}',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 12,
                        fontWeight: isDone ? FontWeight.w700 : FontWeight.w500,
                        color: isDone ? AppTheme.primary : AppTheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Archive Action Button
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFF94A3B8), size: 20),
            onPressed: onDelete,
            tooltip: 'Archive Habit',
          ),

          const SizedBox(width: 4.0),

          // 1-Tap Circular Log Button (Stitch Spec: btn-log-incomplete vs btn-log-completed)
          GestureDetector(
            onTap: onToggle,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 48.0,
              height: 48.0,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isDone ? AppTheme.primaryContainer : Colors.transparent,
                border: Border.all(
                  color: isDone ? AppTheme.primaryContainer : const Color(0xFF94A3B8),
                  width: 2.0,
                ),
                boxShadow: isDone
                    ? [
                        BoxShadow(
                          color: AppTheme.primaryContainer.withOpacity(0.4),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ]
                    : [],
              ),
              child: isDone
                  ? const Icon(Icons.check_rounded, color: Colors.white, size: 28)
                  : const SizedBox.shrink(),
            ),
          ),
        ],
      ),
    );
  }
}

