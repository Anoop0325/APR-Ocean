from rest_framework_simplejwt.tokens import RefreshToken
from .models import User

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def register_user(phone_number, pin, name=None, email=None):
    user = User.objects.create_user(
        phone_number=phone_number,
        name=name,
        password=pin,
        email=email
    )
    return user
