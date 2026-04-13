from rest_framework import serializers

from core.models import Ingredient, Recipe, Tag, Step, Category
from user.serializers import UserSerializer

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class TagSerializer(DynamicFieldsModelSerializer):

    tag_recipes = serializers.StringRelatedField(many=True, required=False)
    class Meta:
        model = Tag
        fields = ['id', 'name','tag_recipes']
        read_only_fields = ['id','tag_recipes']

class IngredientSerializer(DynamicFieldsModelSerializer):

    ingredient_recipes = serializers.StringRelatedField(many=True, required=False)
    class Meta:
        model = Ingredient
        fields = ['id', 'name','ingredient_recipes']
        read_only_fields = ['id','ingredient_recipes']

class StepSerializer(serializers.ModelSerializer):

    class Meta:
        model = Step
        fields = ['id', 'step_number', 'title', 'instruction']
        read_only_fields = ['id']

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['id','name']
        read_only_fields = ['id']

class RecipeSerializer(serializers.ModelSerializer):
    tags = TagSerializer(
            many=True,
            required=False,
            fields=('id', 'name'))
    ingredients = IngredientSerializer(
            many=True,
            required=False,
            fields=('id', 'name'))
    steps = StepSerializer(
            many=True,
            required=False)

    user = UserSerializer(required=False, fields=('id', 'email', 'name', 'profile_picture'))
    category = serializers.SlugRelatedField(required=False, queryset=Category.objects.all(), slug_field='name')

    class Meta:
        model = Recipe
        fields = [
            'id',
            'user',
            'title',
            'description',
            'servings',
            'time_minutes',
            'category',
            'ingredients',
            'steps',
            'chefs_tip',
            'tags',
            'is_featured',
            'image',
        ]
        read_only_fields = ['id','user']

    def _get_or_create_tags(self, tags, recipe):
        auth_user = self.context['request'].user
        for tag in tags:
            tag_obj, created = Tag.objects.get_or_create(
                user=auth_user,
                **tag,
            )
            recipe.tags.add(tag_obj)

    def _get_or_create_ingredients(self, ingredients, recipe):
        auth_user = self.context['request'].user
        for ingredient in ingredients:
            ingredient_obj, created = Ingredient.objects.get_or_create(
                user=auth_user,
                **ingredient,
            )
            recipe.ingredients.add(ingredient_obj)

    def _create_steps(self, steps, recipe):
        for step in steps:
            recipe.steps.create(**step)


    def create(self, validated_data):
        print("Validated Data: ", validated_data)
        tags = validated_data.pop('tags', [])
        ingredients = validated_data.pop('ingredients', [])
        steps = validated_data.pop('steps', [])
        recipe = Recipe.objects.create(**validated_data)
        self._get_or_create_tags(tags, recipe)
        self._get_or_create_ingredients(ingredients, recipe)
        self._create_steps(steps, recipe)
        return recipe

    def update(self, instance, validated_data):
        tags = validated_data.pop('tags', None)
        ingredients = validated_data.pop('ingredients', None)
        steps = validated_data.pop('steps', None)

        if tags is not None:
            instance.tags.clear()
            self._get_or_create_tags(tags, instance)

        if ingredients is not None:
            instance.ingredients.clear()
            self._get_or_create_ingredients(ingredients, instance)

        if steps is not None:
            instance.steps.clear()
            self._create_steps(steps, instance)


        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class RecipeImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Recipe
        fields = ['id', 'image']
        read_only_fields = ['id']
        extra_kwargs = {'image': {'required': 'True'}}

class RecipesByCategorySerializer(serializers.Serializer):
    count = serializers.IntegerField()
    category = serializers.CharField(source='category__name')