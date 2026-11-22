from django.contrib import admin
from .models import Student, Trainer, Course, StudentProfile, Enrollment


class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    extra = 0
    max_num = 1


class EnrollmentInline(admin.TabularInline):
    model = Enrollment
    extra = 1


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'course', 'age', 'created_at')
    search_fields = ('name', 'email')
    list_filter = ('course',)

    inlines = [StudentProfileInline, EnrollmentInline]


@admin.register(Trainer)
class TrainerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone')
    search_fields = ('name', 'email')


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'duration', 'trainer')
    search_fields = ('name',)
    list_filter = ('trainer',)


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'city', 'date_of_birth')
    search_fields = ('student__name', 'city')
    list_filter = ('city',)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'course', 'enrollment_date', 'status')
    search_fields = ('student__name', 'course__name')
    list_filter = ('status', 'enrollment_date')