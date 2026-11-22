from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Student
from .forms import StudentForm


def student_list(request):
    students = Student.objects.all().order_by('id')

    # 1. Search by name or email
    search_query = request.GET.get('search', '').strip()

    if search_query:
        students = students.filter(
            Q(name__icontains=search_query) | Q(email__icontains=search_query)
        )

    # 2. Filter by course (exact match, because it comes from a dropdown)
    course = request.GET.get('course', '').strip()

    if course:
        students = students.filter(course=course)

    # 3. List of all unique courses for the dropdown
    courses = (
        Student.objects.values_list('course', flat=True)
        .distinct()
        .order_by('course')
    )

    # 4. Pagination: 10 students per page
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