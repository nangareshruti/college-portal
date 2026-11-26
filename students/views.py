from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from django.contrib.auth.decorators import login_required, permission_required

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from .models import Student, Course, Trainer
from .forms import StudentForm
from .serializers import StudentSerializer, CourseSerializer, TrainerSerializer


# =========================
# STUDENT LIST
# =========================

@login_required
@permission_required('students.view_student', raise_exception=True)
def student_list(request):

    students = Student.objects.filter(
        is_deleted=False
    ).order_by('id')

    search_query = request.GET.get('search', '').strip()

    if search_query:
        students = students.filter(
            Q(name__icontains=search_query) |
            Q(email__icontains=search_query)
        )

    course = request.GET.get('course', '').strip()

    if course:
        students = students.filter(course=course)

    courses = (
        Student.objects.filter(is_deleted=False)
        .values_list('course', flat=True)
        .distinct()
        .order_by('course')
    )

    paginator = Paginator(students, 10)

    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    return render(
        request,
        'students/student_list.html',
        {
            'students': page_obj.object_list,
            'page_obj': page_obj,
            'search_query': search_query,
            'course': course,
            'courses': courses,
            'selected_course': course,
        }
    )


# =========================
# CREATE STUDENT
# =========================

@login_required
@permission_required('students.add_student', raise_exception=True)
def student_create(request):

    if request.method == 'POST':
        form = StudentForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            return redirect('student_list')

    else:
        form = StudentForm()

    return render(
        request,
        'students/student_form.html',
        {'form': form}
    )


# =========================
# UPDATE STUDENT
# =========================

@login_required
@permission_required('students.change_student', raise_exception=True)
def student_update(request, student_id):

    student = get_object_or_404(
        Student,
        id=student_id,
        is_deleted=False
    )

    if request.method == 'POST':
        form = StudentForm(
            request.POST,
            request.FILES,
            instance=student
        )

        if form.is_valid():
            form.save()
            return redirect('student_list')

    else:
        form = StudentForm(instance=student)

    return render(
        request,
        'students/student_form.html',
        {
            'form': form,
            'student': student
        }
    )


# =========================
# SOFT DELETE STUDENT
# =========================

@login_required
@permission_required('students.delete_student', raise_exception=True)
def student_delete(request, student_id):

    student = get_object_or_404(
        Student,
        id=student_id,
        is_deleted=False
    )

    if request.method == 'POST':

        student.is_deleted = True
        student.save()

        return redirect('student_list')

    return render(
        request,
        'students/student_confirm_delete.html',
        {'student': student}
    )


# =========================
# REST API - STUDENT LIST & CREATE
# =========================

class StudentAPIView(ListCreateAPIView):

    queryset = Student.objects.filter(
        is_deleted=False
    ).order_by('id')

    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]


# =========================
# REST API - SINGLE STUDENT
# =========================

class StudentDetailAPIView(RetrieveUpdateDestroyAPIView):

    queryset = Student.objects.filter(
        is_deleted=False
    )

    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()


# =========================
# REST API - COURSE LIST & CREATE
# =========================

class CourseAPIView(ListCreateAPIView):

    queryset = Course.objects.select_related('trainer').all().order_by('id')

    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


# =========================
# REST API - SINGLE COURSE
# =========================

class CourseDetailAPIView(RetrieveUpdateDestroyAPIView):

    queryset = Course.objects.select_related('trainer').all()

    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


# =========================
# REST API - TRAINER LIST
# =========================

class TrainerAPIView(ListCreateAPIView):

    queryset = Trainer.objects.all().order_by('id')

    serializer_class = TrainerSerializer
    permission_classes = [IsAuthenticated]
    # =========================
# REST API - SINGLE TRAINER
# =========================

class TrainerDetailAPIView(RetrieveUpdateDestroyAPIView):

    queryset = Trainer.objects.all()

    serializer_class = TrainerSerializer
    permission_classes = [IsAuthenticated]