"""
Serializers for the user API view
"""

from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from django.utils.translation import gettext as _
from rest_framework import serializers
from core.models import AccessHistory

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

class AccessHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessHistory
        fields = ["access_time", "ip_address", "browser", "os", "device", "location"]

class UserSerializer(DynamicFieldsModelSerializer):
    access_history = AccessHistorySerializer(many=True, read_only=True)

    class Meta:
        model = get_user_model()
        fields = ["email", "password", "name", "profile_picture", "access_history"]
        extra_kwargs = {"password": {"write_only": True, "min_length": 8}}
        read_only_fields = ["access_history"]


    def create(self, validated_data):
        """Create and return a user with encrypted password"""
        return get_user_model().objects.create_user(**validated_data)

    def update(self, instance, validated_data):
        """Update and return user"""
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user

class AuthTokenSerializer(serializers.Serializer):
    """Serializer for the user auth token"""

    email = serializers.EmailField()
    password = serializers.CharField(
        style={"input_type": "password"},
        trim_whitespace=False,
    )

    def validate(self, attrs):
        """Validate and authenticate the user"""
        email = attrs.get("email")
        password = attrs.get("password")
        request = self.context.get("request")
        user = authenticate(
            request=request,
            username=email,
            password=password,
        )
        if not user:
            msg = _("Unable to authenticate with provided credentials.")
            raise serializers.ValidationError(msg, code="author")

        device_type = "Unknown"
        if request.user_agent.is_mobile:
            device_type = request.user_agent.device.family
        if request.user_agent.is_tablet:
            device_type = request.user_agent.device.family
        if request.user_agent.is_pc:
            device_type = "PC"

        ip_address = request.META.get('HTTP_X_FORWARDED_FOR')
        if ip_address:
            ip_address = ip_address.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')

        access_history = AccessHistory.objects.create(
            ip_address=ip_address,
            browser=f"{request.user_agent.browser.family} {request.user_agent.browser.version_string}",
            os=request.user_agent.os.family,
            device=device_type,
            location="unknown",
        )
        user.access_history.add(access_history)
        user.save()
        attrs["user"] = user
        return attrs
