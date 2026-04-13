"""
Tests for models
"""

from unittest.mock import patch
from decimal import Decimal

from django.test import TestCase
from django.contrib.auth import get_user_model

from core import models


def create_user(email="user@example.com", password="testpass123"):
    return get_user_model().objects.create_user(email, password)

class ModelTests(TestCase):

    def test_create_user_with_email_successful(self):
        email = "test@example.com"
        password = "testpass123"
        user = create_user(email, password)

        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalized(self):
        sample_emails = [
            ["test1@EXAMPLE.com", "test1@example.com"],
            ["Test2@Example.com", "Test2@example.com"],
            ["TEST3@EXAMPLE.COM", "TEST3@example.com"],
            ["test4@example.COM", "test4@example.com"],
        ]

        for email, expected in sample_emails:
            user = create_user(email, "sample123")
            self.assertEqual(user.email, expected)

    def test_new_user_without_email_raises_error(self):
        with self.assertRaises(ValueError):
            create_user("", "test123")

    def test_create_superuser(self):
        user = get_user_model().objects.create_superuser(
            email="test@example.com", password="test123"
        )

        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_category(self):
        category = models.Category.objects.create(name="Category Test")
        self.assertEqual(str(category), category.name)

    def test_create_recipe(self):
        user = create_user("test@example.com", "testpass123")
        category = models.Category.objects.create(name="Category Sample")
        recipe = models.Recipe.objects.create(
            user=user,
            category=category,
            title="Sample Recipe Name",
            time_minutes=5,
            description="Sample recipe description",
            is_featured=True,
        )

        self.assertEqual(str(recipe), recipe.title)

    def test_create_step(self):
        user = create_user("test@example.com", "testpass123")
        category = models.Category.objects.create(name="Category Sample 2")
        recipe = models.Recipe.objects.create(
            user=user,
            category=category,
            title="Sample Recipe Name",
            time_minutes=5,
            description="Sample recipe description",
            is_featured=True,
        )
        step1 = recipe.steps.create(step_number=1, title="Step 1", instruction="Description 1")
        step2 = recipe.steps.create(step_number=2, title="Step 2", instruction="Description 2")

        self.assertEqual(recipe.steps.count(), 2)

    def test_create_tag(self):
        user = create_user()
        tag = models.Tag.objects.create(user=user, name="Tag1")

        self.assertEqual(str(tag), tag.name)

    def test_create_ingredient(self):
        user = create_user()
        ingredient = models.Ingredient.objects.create(
            user=user, name='Ingredient One'
        )

        self.assertEqual(str(ingredient), ingredient.name)

    @patch('core.models.uuid.uuid4')
    def test_recipe_filename_uuid(self, mock_uuid):
        """Test generating image path"""
        uuid = 'test-uuid'
        mock_uuid.return_value = uuid
        file_path = models.recipe_image_file_path(None, 'example.jpg')

        self.assertEqual(file_path, f'uploads/recipe/{uuid}.jpg')
