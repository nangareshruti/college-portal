"""Tasks 31-32: Django models with one-to-one, one-to-many and many-to-many links.

This is the same design as the PostgreSQL tables from Day 2.
"""
from django.core.validators import MinValueValidator
from django.db import models


class Trainer(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    class Meta:
        ordering = ["full_name"]

    def __str__(self):
        return self.full_name


class Course(models.Model):
    title = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    duration_weeks = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    fee = models.DecimalField(max_digits=10, decimal_places=2, default=0,
                              validators=[MinValueValidator(0)])
    # ONE-TO-MANY: one trainer teaches many courses
    trainer = models.ForeignKey(Trainer, null=True, blank=True,
                                on_delete=models.SET_NULL, related_name="courses")

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title


class Student(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=60, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # MANY-TO-MANY: a student joins many courses, a course has many students.
    # "through" tells Django to use our Enrollment table as the link.
    courses = models.ManyToManyField(Course, through="Enrollment", related_name="students")

    class Meta:
        ordering = ["full_name"]

    def __str__(self):
        return self.full_name


class StudentProfile(models.Model):
    # ONE-TO-ONE: each student has at most one profile
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True)
    linkedin_url = models.URLField(blank=True)

    def __str__(self):
        return f"Profile of {self.student}"


class Enrollment(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("dropped", "Dropped"),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.PROTECT)
    enrolled_on = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="active")

    class Meta:
        constraints = [
            # a student cannot join the same course twice
            models.UniqueConstraint(fields=["student", "course"], name="unique_enrollment"),
        ]

    def __str__(self):
        return f"{self.student} -> {self.course} ({self.status})"
