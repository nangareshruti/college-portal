from django.urls import path
from . import views

urlpatterns = [

    # =========================
    # STUDENT PAGES
    # =========================

    path('', views.student_list, name='student_list'),

    path('add/', views.student_create, name='student_create'),

    path(
        'edit/<int:student_id>/',
        views.student_update,
        name='student_update'
    ),

    path(
        'delete/<int:student_id>/',
        views.student_delete,
        name='student_delete'
    ),


    # =========================
    # REST API - LIST & CREATE
    # =========================

    path(
        'api/students/',
        views.StudentAPIView.as_view(),
        name='student_api'
    ),


    # =========================
    # REST API - SINGLE STUDENT
    # =========================

    path(
        'api/students/<int:pk>/',
        views.StudentDetailAPIView.as_view(),
        name='student_detail_api'
    ),
]