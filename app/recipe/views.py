from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
    OpenApiTypes,
)
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, F

from core.models import Recipe, Tag, Ingredient, Category
from recipe import serializers


@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                'tags',
                OpenApiTypes.STR,
                description='Comma separated list of tag IDs to filter',
            ),
            OpenApiParameter(
                'ingredients',
                OpenApiTypes.STR,
                description='Comma separated list of ingredient IDs to filter',
            ),
            OpenApiParameter(
                'is_featured',
                OpenApiTypes.BOOL,
                description='Value to filter featured recipes only'
            ),
            OpenApiParameter(
                'limit',
                OpenApiTypes.INT,
                description='Number of recipes to return'
            ),
            OpenApiParameter(
                'offset',
                OpenApiTypes.INT,
                description='Number of recipes to skip'
            )
        ]
    )
)
class RecipeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RecipeSerializer
    queryset = Recipe.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return []
        return super().get_permissions()

    def _params_to_ints(self, qs):
        return [int(str_id) for str_id in qs.split(',')]

    def get_queryset(self):
        super().get_queryset()
        queryset = self.queryset
        user = self.request.user
        title = self.request.query_params.get('title')
        tags = self.request.query_params.get('tags')
        ingredients = self.request.query_params.get('ingredients')
        featured = self.request.query_params.get('is_featured')
        limit = self.request.query_params.get('limit')
        offset = self.request.query_params.get('offset')

        if title:
            queryset = queryset.filter(title__icontains=title)
        if tags:
            tag_ids = self._params_to_ints(tags)
            for tag in tag_ids:
                queryset = queryset.filter(tags__id=tag)
        if ingredients:
            ingredient_ids = self._params_to_ints(ingredients)
            for ingredient in ingredient_ids:
                queryset = queryset.filter(ingredients__id=ingredient)
        if user.is_authenticated:
            queryset = queryset.filter(user=user)
        if featured:
            queryset = queryset.filter(is_featured=True)
        if limit and offset:
            return queryset.order_by('-id').distinct()[int(offset):int(offset) + int(limit)]

        return queryset.order_by('-id').distinct()

    def get_serializer_class(self):
        serializer = super().get_serializer_class()

        if self.action == 'upload_image':
            serializer = serializers.RecipeImageSerializer
        return serializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['POST'], detail=True, url_path='upload-image')
    def upload_image(self, request, pk=None):
        recipe = self.get_object()
        serializer = self.get_serializer(recipe, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['GET'], detail=False, url_path='recipes-by-category')
    def recipes_by_category(self, request):
        queryset = self.get_queryset()
        serializer = serializers.RecipesByCategorySerializer
        queryset = queryset.filter(user=request.user).values('category__name').annotate(count=Count('id')).order_by('category__name')
        return Response(serializer(queryset, many=True).data)

    @action(methods=['GET'], detail=False, url_path='all-recipes', permission_classes=[])
    def all_recipes(self, request):
        queryset = Recipe.objects.all()
        serializer = serializers.RecipeSerializer
        return Response(serializer(queryset, many=True).data)

@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                'assigned_only',
                OpenApiTypes.INT,
                enum=[0, 1],
                description='Filter by items assigned to recipes',
            )
        ]
    )
)
class BaseRecipeAttrViewSet(
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """Base ViewSet for recipe attributes (Tags and Ingredients)"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'list':
            return []
        return super().get_permissions()

    def get_queryset(self):
        super().get_queryset()
        assigned_only = bool(
            int(self.request.query_params.get('assigned_only', 0))
        )
        queryset = self.queryset

        if assigned_only:
            if self.serializer_class == serializers.TagSerializer:
                queryset = queryset.filter(tag_recipes__isnull=False)
            else:
                queryset = queryset.filter(ingredient_recipes__isnull=False)

        # return queryset.filter(user=self.request.user).order_by('name').distinct()
        return queryset.order_by('name').distinct()


class TagViewSet(BaseRecipeAttrViewSet):
    serializer_class = serializers.TagSerializer
    queryset = Tag.objects.all()


class IngredientViewSet(BaseRecipeAttrViewSet):
    serializer_class = serializers.IngredientSerializer
    queryset = Ingredient.objects.all()


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CategorySerializer
    queryset = Category.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return []
        return super().get_permissions()

    def get_queryset(self):
        super().get_queryset()
        return self.queryset.order_by('name')
