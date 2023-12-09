from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('login', views.login_view, name="login"),
    path('register', views.register, name="register"),
    path('logout', views.logout_view, name="logout"),
    path('logs', views.logs, name="history"),
    path('addTask', views.addTask, name="addTask"),
    path('deleteTask/<int:taskID>', views.deleteTask, name="deleteTask"),
    path('completeTask/<int:taskID>', views.completeTask, name="completeTask"),
    path('updateToday', views.updateDayStatus, name="updateDayStatus"),
    path('getLog/<str:reqDate>', views.getLog, name="getLog"),
    path('getTasks/<int:taskTypes>', views.getTasks, name="getTasks"),
    path('getNightMode', views.getNightMode, name="nightMode")
]