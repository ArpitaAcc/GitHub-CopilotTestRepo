from django.test import TestCase
from .models import User, Team, Activity, Leaderboard, Workout

class ModelTestCase(TestCase):
    def test_user_creation(self):
        user = User.objects.create(name='Test User', email='test@example.com', team='Test Team')
        self.assertEqual(user.name, 'Test User')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.team, 'Test Team')

    def test_team_creation(self):
        team = Team.objects.create(name='Test Team')
        self.assertEqual(team.name, 'Test Team')

    def test_activity_creation(self):
        activity = Activity.objects.create(user='Test User', activity='Running', duration=30)
        self.assertEqual(activity.user, 'Test User')
        self.assertEqual(activity.activity, 'Running')
        self.assertEqual(activity.duration, 30)

    def test_leaderboard_creation(self):
        lb = Leaderboard.objects.create(user='Test User', points=100)
        self.assertEqual(lb.user, 'Test User')
        self.assertEqual(lb.points, 100)

    def test_workout_creation(self):
        workout = Workout.objects.create(user='Test User', workout='Pushups', reps=20)
        self.assertEqual(workout.user, 'Test User')
        self.assertEqual(workout.workout, 'Pushups')
        self.assertEqual(workout.reps, 20)
