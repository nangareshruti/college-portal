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
    # REST API - STUDENTS
    # =========================

    path(
        'api/students/',
        views.StudentAPIView.as_view(),
        name='student_api'
    ),

    path(
        'api/students/<int:pk>/',
        views.StudentDetailAPIView.as_view(),
        name='student_detail_api'
    ),


    # =========================
    # REST API - COURSES
    # =========================

    path(
        'api/courses/',
        views.CourseAPIView.as_view(),
        name='course_api'
    ),

    path(
        'api/courses/<int:pk>/',
        views.CourseDetailAPIView.as_view(),
        name='course_detail_api'
    ),


    # =========================
    # REST API - TRAINERS
    # =========================

    path(
        'api/trainers/',
        views.TrainerAPIView.as_view(),
        name='trainer_api'
    ),
    path(
    'api/trainers/<int:pk>/',
    views.TrainerDetailAPIView.as_view(),
    name='trainer_detail_api'
),
]