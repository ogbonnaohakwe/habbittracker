import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:habbit/main.dart';
import 'package:habbit/screens/home_screen.dart';
import 'package:habbit/screens/auth_screen.dart';
import 'package:habbit/services/supabase_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('App renders HomeScreen with The Quiet Coach header', (WidgetTester tester) async {
    await tester.pumpWidget(const ZenithApp());
    await tester.pumpAndSettle();

    expect(find.text('The Quiet Coach'), findsOneWidget);
    expect(find.byType(FloatingActionButton), findsOneWidget);
    expect(find.text('Habits'), findsOneWidget);
    expect(find.text('Progress'), findsOneWidget);
    expect(find.text('Settings'), findsOneWidget);
  });

  testWidgets('BottomNavigationBar switches to Progress and Settings tabs', (WidgetTester tester) async {
    await tester.pumpWidget(const ZenithApp());
    await tester.pumpAndSettle();

    // Tap on Progress tab
    await tester.tap(find.text('Progress'));
    await tester.pumpAndSettle();
    expect(find.text('Analytics & Progress'), findsOneWidget);
    expect(find.text('TODAY\'S COMPLETION RATE'), findsOneWidget);

    // Tap on Settings tab
    await tester.tap(find.text('Settings'));
    await tester.pumpAndSettle();
    expect(find.text('Settings & Sync'), findsOneWidget);
    expect(find.text('Live Cloud Sync'), findsOneWidget);
    expect(find.text('https://habbitrac.netlify.app/'), findsOneWidget);
  });

  testWidgets('AuthScreen opens and renders Email and Password fields', (WidgetTester tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => HabitService(),
        child: const MaterialApp(
          home: AuthScreen(),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Welcome Back'), findsOneWidget);
    expect(find.text('Email Address'), findsOneWidget);
    expect(find.text('Password'), findsOneWidget);
    expect(find.text('Log In'), findsOneWidget);

    // Switch to Sign Up
    await tester.tap(find.text('Don\'t have an account? Sign up'));
    await tester.pumpAndSettle();

    expect(find.text('Create Zenith Account'), findsOneWidget);
    expect(find.text('Sign Up'), findsOneWidget);
  });

  test('HabitService local state and 3 habit limit', () async {
    final service = HabitService();
    // Verify limit constraint logic
    expect(service.isLimitReached, isFalse);
    expect(service.activeHabitsCount, inInclusiveRange(0, 3));
  });
}
