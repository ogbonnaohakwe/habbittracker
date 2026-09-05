import 'package:intl/intl.dart';

class Habit {
  final String id;
  final String userId;
  final String name;
  final String category;
  final int streakCount;
  final String? lastCompletedAt;
  final bool archived;
  final bool isCompletedToday;

  Habit({
    required this.id,
    required this.userId,
    required this.name,
    this.category = 'General',
    this.streakCount = 0,
    this.lastCompletedAt,
    this.archived = false,
    this.isCompletedToday = false,
  });

  factory Habit.fromJson(Map<String, dynamic> json) {
    final lastComp = json['last_completed_at'] as String?;
    final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final completedToday = json['is_completed_today'] as bool? ?? (lastComp == todayStr);

    return Habit(
      id: json['id'] as String,
      userId: json['user_id'] as String? ?? 'user_default',
      name: json['name'] as String,
      category: json['category'] as String? ?? 'General',
      streakCount: json['streak_count'] as int? ?? 0,
      lastCompletedAt: lastComp,
      archived: json['archived'] as bool? ?? false,
      isCompletedToday: completedToday,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'name': name,
      'category': category,
      'streak_count': streakCount,
      'last_completed_at': lastCompletedAt,
      'archived': archived,
      'is_completed_today': isCompletedToday,
    };
  }

  Habit copyWith({
    String? name,
    String? category,
    int? streakCount,
    String? lastCompletedAt,
    bool? archived,
    bool? isCompletedToday,
  }) {
    return Habit(
      id: id,
      userId: userId,
      name: name ?? this.name,
      category: category ?? this.category,
      streakCount: streakCount ?? this.streakCount,
      lastCompletedAt: lastCompletedAt ?? this.lastCompletedAt,
      archived: archived ?? this.archived,
      isCompletedToday: isCompletedToday ?? this.isCompletedToday,
    );
  }
}
