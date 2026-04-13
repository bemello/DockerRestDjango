"""
Database models
"""

import uuid
import os

from django.conf import settings
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)


def recipe_image_file_path(instance, filename):
    ext = os.path.splitext(filename)[1]
    filename = f'{uuid.uuid4()}{ext}'

    return os.path.join('uploads', 'recipe', filename)


class UserManager(BaseUserManager):
    """
    Manager for users
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Create, save and return a new user
        """
        if not email:
            raise ValueError('User must have an email address')

        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """
        Create and return a new superuser
        """
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user

class AccessHistory(models.Model):
    access_time = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    browser = models.CharField(max_length=255)
    os = models.CharField(max_length=255)
    device = models.CharField(max_length=255)
    location = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.access_time} - {self.ip_address}"

class User(AbstractBaseUser, PermissionsMixin):
    """
    Docstring for User
    Custom User
    """

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='profile_pics', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    access_history = models.ManyToManyField(AccessHistory, related_name='user')

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

class Tag(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Ingredient(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Step(models.Model):
    step_number = models.IntegerField()
    title = models.CharField(max_length=255)
    instruction = models.TextField(blank=True, max_length=5000)

    def __str__(self):
        return str(self.step_number) + ': ' + self.title

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Recipe(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, max_length=100)
    servings = models.IntegerField(null=False, default=1)
    time_minutes = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, related_name="tag_recipes")
    ingredients = models.ManyToManyField(Ingredient, related_name="ingredient_recipes")
    steps = models.ManyToManyField(Step, blank=True)
    image = models.ImageField(null=True, blank=True, upload_to=recipe_image_file_path)
    is_featured = models.BooleanField(null=False, default=False, blank=False)
    chefs_tip = models.TextField(blank=True, max_length=1000)

    def __str__(self):
        return self.title


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit = models.CharField(max_length=80)

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.ingredient.name}"
