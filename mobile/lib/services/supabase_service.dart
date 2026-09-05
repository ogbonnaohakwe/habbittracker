import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../models/habit.dart';

class HabitService extends ChangeNotifier {
  static const String _storageKey = 'zenith_mobile_habits_v1';
  List<Habit> _habits = [];
  bool _isLoading = false;
  String? _userEmail;
  String? _userId;

  List<Habit> get habits => _habits.where((h) => !h.archived).toList();
  bool get isLoading => _isLoading;
  String? get userEmail => _userEmail ?? _supabaseClient?.auth.currentUser?.email;
  bool get isAuthenticated => _supabaseClient?.auth.currentUser != null;

  int get activeHabitsCount => habits.length;
  bool get isLimitReached => activeHabitsCount >= 3;

  SupabaseClient? get _supabaseClient {
    try {
      return Supabase.instance.client;
    } catch (_) {
      return null;
    }
  }

  HabitService() {
    _loadInitialState();
  }

  Future<void> _loadInitialState() async {
    try {
      await _loadLocalHabits();
    } catch (e) {
      debugPrint('Local habits load error: $e');
    }

    final client = _supabaseClient;
    if (client != null && client.auth.currentUser != null) {
      _userId = client.auth.currentUser!.id;
      _userEmail = client.auth.currentUser!.email;
      await fetchHabitsFromSupabase();
    }
  }

  Future<void> _loadLocalHabits() async {
    final prefs = await SharedPreferences.getInstance();
    final String? cached = prefs.getString(_storageKey);

    if (cached != null && cached.isNotEmpty) {
      final List<dynamic> list = jsonDecode(cached);
      _habits = list.map((item) => Habit.fromJson(item)).toList();
    } else {
      // Provide default starter habits so user can test UI immediately
      final todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
      _habits = [
        Habit(
          id: 'starter_1',
          userId: 'local_demo',
          name: 'Drink 2L Water',
          category: 'Health',
          streakCount: 14,
          isCompletedToday: true,
          lastCompletedAt: todayStr,
        ),
        Habit(
          id: 'starter_2',
          userId: 'local_demo',
          name: 'Read 10 Pages',
          category: 'Mindset',
          streakCount: 7,
          isCompletedToday: false,
        ),
        Habit(
          id: 'starter_3',
          userId: 'local_demo',
          name: 'Morning Stretch',
          category: 'Fitness',
          streakCount: 3,
          isCompletedToday: false,
        ),
      ];
      await _saveToDisk();
    }
    notifyListeners();
  }

  Future<void> _saveToDisk() async {
    final prefs = await SharedPreferences.getInstance();
    final String encoded = jsonEncode(_habits.map((h) => h.toJson()).toList());
    await prefs.setString(_storageKey, encoded);
  }

  Future<void> fetchHabitsFromSupabase() async {
    final client = _supabaseClient;
    if (client == null || client.auth.currentUser == null) return;

    try {
      final response = await client
          .from('habits')
          .select()
          .eq('user_id', client.auth.currentUser!.id)
          .eq('archived', false)
          .order('created_at', ascending: false);

      final List<dynamic> data = response as List<dynamic>;
      _habits = data.map((json) => Habit.fromJson(json as Map<String, dynamic>)).toList();
      await _saveToDisk();
      notifyListeners();
    } catch (e) {
      debugPrint('Error fetching habits from Supabase: $e');
      await _loadLocalHabits();
    }
  }

  String? _lastAuthError;
  String? get lastAuthError => _lastAuthError;

  Future<bool> signUp(String email, String password) async {
    _lastAuthError = null;
    final client = _supabaseClient;
    if (client == null) {
      _lastAuthError = 'Supabase client is not initialized.';
      return false;
    }

    try {
      final res = await client.auth.signUp(email: email, password: password);
      if (res.user != null) {
        _userId = res.user!.id;
        _userEmail = res.user!.email;
        await fetchHabitsFromSupabase();
        notifyListeners();
        return true;
      } else {
        _lastAuthError = 'Unable to create user account.';
      }
    } on AuthException catch (e) {
      _lastAuthError = e.message;
      debugPrint('Sign up AuthException: ${e.message}');
    } catch (e) {
      _lastAuthError = e.toString();
      debugPrint('Sign up error: $e');
    }
    return false;
  }

  Future<bool> signIn(String email, String password) async {
    _lastAuthError = null;
    final client = _supabaseClient;
    if (client == null) {
      _lastAuthError = 'Supabase client is not initialized.';
      return false;
    }

    try {
      final res = await client.auth.signInWithPassword(email: email, password: password);
      if (res.user != null) {
        _userId = res.user!.id;
        _userEmail = res.user!.email;
        await fetchHabitsFromSupabase();
        notifyListeners();
        return true;
      } else {
        _lastAuthError = 'Invalid email or password.';
      }
    } on AuthException catch (e) {
      _lastAuthError = e.message;
      debugPrint('Sign in AuthException: ${e.message}');
    } catch (e) {
      _lastAuthError = e.toString();
      debugPrint('Sign in error: $e');
    }
    return false;
  }

  Future<void> signOut() async {
    final client = _supabaseClient;
    if (client != null) {
      await client.auth.signOut();
    }
    _userEmail = null;
    _userId = null;
    await _loadLocalHabits();
    notifyListeners();
  }

  Future<bool> addHabit(String name, String category) async {
    if (isLimitReached) {
      return false; // Active 3 habit cap enforced
    }

    final newId = 'h_${DateTime.now().millisecondsSinceEpoch}';
    final String cat = category.trim().isEmpty ? 'General' : category.trim();
    final uid = _userId ?? _supabaseClient?.auth.currentUser?.id ?? 'user_default';

    final newHabit = Habit(
      id: newId,
      userId: uid,
      name: name.trim(),
      category: cat,
      streakCount: 0,
      isCompletedToday: false,
    );

    _habits.insert(0, newHabit);
    await _saveToDisk();
    notifyListeners();

    // Sync with Supabase if online
    final client = _supabaseClient;
    if (client != null && client.auth.currentUser != null) {
      try {
        await client.from('habits').insert({
          'user_id': client.auth.currentUser!.id,
          'name': name.trim(),
          'category': cat,
          'streak_count': 0,
          'archived': false,
        });
        await fetchHabitsFromSupabase();
      } catch (e) {
        debugPrint('Supabase insert habit error: $e');
      }
    }

    return true;
  }

  Future<void> toggleHabitCompletion(String habitId) async {
    final index = _habits.indexWhere((h) => h.id == habitId);
    if (index == -1) return;

    final target = _habits[index];
    final String todayStr = DateFormat('yyyy-MM-dd').format(DateTime.now());
    final String yesterdayStr = DateFormat('yyyy-MM-dd').format(
      DateTime.now().subtract(const Duration(days: 1)),
    );

    int newStreak;
    String? newLastCompleted;
    bool newCompletedToday;

    if (target.isCompletedToday) {
      // Undo completion
      newStreak = (target.streakCount - 1).clamp(0, 9999);
      newLastCompleted = null;
      newCompletedToday = false;
    } else {
      // Mark completed for today
      if (target.lastCompletedAt == yesterdayStr) {
        newStreak = target.streakCount + 1;
      } else {
        newStreak = 1;
      }
      newLastCompleted = todayStr;
      newCompletedToday = true;
    }

    _habits[index] = target.copyWith(
      streakCount: newStreak,
      lastCompletedAt: newLastCompleted,
      isCompletedToday: newCompletedToday,
    );

    await _saveToDisk();
    notifyListeners();

    // Sync with Supabase if online
    final client = _supabaseClient;
    if (client != null && client.auth.currentUser != null) {
      try {
        await client.from('habits').update({
          'streak_count': newStreak,
          'last_completed_at': newLastCompleted,
        }).eq('id', habitId);

        if (newCompletedToday) {
          await client.from('habit_logs').upsert({
            'habit_id': habitId,
            'user_id': client.auth.currentUser!.id,
            'completed_date': todayStr,
          });
        } else {
          await client
              .from('habit_logs')
              .delete()
              .eq('habit_id', habitId)
              .eq('completed_date', todayStr);
        }
      } catch (e) {
        debugPrint('Supabase toggle habit error: $e');
      }
    }
  }

  Future<void> archiveHabit(String habitId) async {
    final index = _habits.indexWhere((h) => h.id == habitId);
    if (index == -1) return;

    _habits[index] = _habits[index].copyWith(archived: true);
    await _saveToDisk();
    notifyListeners();

    final client = _supabaseClient;
    if (client != null && client.auth.currentUser != null) {
      try {
        await client.from('habits').update({'archived': true}).eq('id', habitId);
      } catch (e) {
        debugPrint('Supabase archive habit error: $e');
      }
    }
  }
}
