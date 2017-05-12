from django.shortcuts import render
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication

from rest_framework.permissions import AllowAny
from rest_framework import status

from .serializers import PersonSerializer, UserSerializer
from .models import Person


def index(request):
    context = {}
    return render(request, 'area/index.html', context)


class ListUsers(APIView):
    """
    View to list all users in the system.

    * Requires token authentication.
    * Only admin users are able to access this view.
    """
    def get(self, request, format=None):
        """
        Return a list of all users.
        """
        usernames = [user.username for user in get_user_model().objects.all()]
        return Response(usernames)


class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(LoginView, self).post(request, *args, **kwargs)
        token = Token.objects.select_related('user').get(key=response.data['token'])
        response.data.update(dict(
            username=token.user.username,
            first_name=token.user.first_name,
            last_name=token.user.last_name
            ))
        return response


class RegisterView(generics.CreateAPIView):
    """
    Register API View
    """
    permission_classes = (AllowAny,)
    serializer_class = PersonSerializer

    def post(self, request, format=None):
        """
        Handles the register request
        """
        serializer = UserSerializer(data=request.data)
        #import ipdb;ipdb.set_trace()
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        response_data = dict(token=user.auth_token.key,
                             username=user.username,
                             first_name=user.first_name,
                             last_name=user.last_name)
        return Response(response_data, status=status.HTTP_200_OK)


class PersonView(generics.RetrieveUpdateAPIView):
    """
    Person API View
    """
    serializer_class = PersonSerializer
    authentication_classes = (TokenAuthentication,)

    def get(self, request, format=None):
        """
        Gets the profile
        """
        person = Person.objects.get(user=request.user)
        serializer = PersonSerializer(person)
        return Response(serializer.data,
                        status=status.HTTP_200_OK)

    def put(self, request, format=None):
        """
        Processes the profile form
        """
        serializer = PersonSerializer(request.user.person,
                                  data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({},
                        status=status.HTTP_200_OK)
