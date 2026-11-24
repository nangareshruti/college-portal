from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from django.contrib.auth.decorators import login_required, permission_required

from .models import Student
from .forms import StudentForm


# =========================
# STUDENT LIST
# =========================

@login_required
@permission_required('students.view_student', raise_exception=True)
def student_list(request):

    students = Student.objects.all().order_by('id')

    # Search by name or email
    search_query = request.GET.get('search', '').strip()

    if search_query:
        students = students.filter(
            Q(name__icontains=search_query) |
            Q(email__icontains=search_query)
        )

    # Filter by course
    course = request.GET.get('course', '').strip()

    if course:
        students = students.filter(course=course)

    # Get unique courses
    courses = (
        Student.objects.values_list('course', flat=True)
        .distinct()
        .order_by('course')
    )

    # Pagination
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
        form = StudentForm(request.POST)

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

    student = get_object_or_404(Student, id=student_id)

    if request.method == 'POST':
        form = StudentForm(request.POST, instance=student)

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
# DELETE STUDENT
# =========================

@login_required
@permission_required('students.delete_student', raise_exception=True)
def student_delete(request, student_id):

    student = get_object_or_404(Student, id=student_id)

    if request.method == 'POST':
        student.delete()
        return redirect('student_list')

    return render(
        request,
        'students/student_confirm_delete.html',
        {'student': student}
    )