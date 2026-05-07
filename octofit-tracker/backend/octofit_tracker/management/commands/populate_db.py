from django.core.management.base import BaseCommand
from django.conf import settings
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        # Clear existing data
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Teams
        teams = [
            {'name': 'Team Marvel'},
            {'name': 'Team DC'}
        ]
        team_ids = db.teams.insert_many(teams).inserted_ids

        # Users (super heroes)
        users = [
            {'name': 'Iron Man', 'email': 'ironman@marvel.com', 'team': 'Team Marvel'},
            {'name': 'Captain America', 'email': 'cap@marvel.com', 'team': 'Team Marvel'},
            {'name': 'Wonder Woman', 'email': 'wonderwoman@dc.com', 'team': 'Team DC'},
            {'name': 'Batman', 'email': 'batman@dc.com', 'team': 'Team DC'}
        ]
        db.users.insert_many(users)
        db.users.create_index([('email', 1)], unique=True)

        # Activities
        activities = [
            {'user': 'Iron Man', 'activity': 'Running', 'duration': 30},
            {'user': 'Captain America', 'activity': 'Cycling', 'duration': 45},
            {'user': 'Wonder Woman', 'activity': 'Swimming', 'duration': 60},
            {'user': 'Batman', 'activity': 'Yoga', 'duration': 40}
        ]
        db.activities.insert_many(activities)

        # Leaderboard
        leaderboard = [
            {'user': 'Iron Man', 'points': 100},
            {'user': 'Captain America', 'points': 90},
            {'user': 'Wonder Woman', 'points': 110},
            {'user': 'Batman', 'points': 95}
        ]
        db.leaderboard.insert_many(leaderboard)

        # Workouts
        workouts = [
            {'user': 'Iron Man', 'workout': 'Pushups', 'reps': 50},
            {'user': 'Captain America', 'workout': 'Situps', 'reps': 60},
            {'user': 'Wonder Woman', 'workout': 'Squats', 'reps': 70},
            {'user': 'Batman', 'workout': 'Pullups', 'reps': 30}
        ]
        db.workouts.insert_many(workouts)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
