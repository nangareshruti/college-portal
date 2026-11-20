"""Task 34: admin panel setup. Gives you a ready-made management website."""
from django.contrib import admin

from .models import Course, Enrollment, Student, StudentProfile, Trainer


class EnrollmentInline(admin.TabularInline):
    model = Enrollment
    extra = 1  # one empty row to add a course quickly


class ProfileInline(admin.StackedInline):
    model = StudentProfile


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "city", "created_at")
    search_fields = ("full_name", "email", "city")
    list_filter = ("city",)
    inlines = [ProfileInline, EnrollmentInline]


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "trainer", "duration_weeks", "fee")
    search_fields = ("title",)
    list_filter = ("trainer",)


@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email")
    search_fields = ("full_name", "email")


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "status", "enrolled_on")
    list_filter = ("status", "course")
