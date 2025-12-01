from django.urls import path

from . import views

urlpatterns = [
    path('register/',views.register_user,name='register'),
    path('login/',views.login_user,name='login'),
    path('profile/',views.profile_user,name='profile'),
    path('profile/update/',views.update_profile,name='profile-update'),
]


