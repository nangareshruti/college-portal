from django import forms
from .models import Student


class StudentForm(forms.ModelForm):

    course = forms.CharField(
        required=True,
        widget=forms.TextInput(attrs={
            'placeholder': 'Enter course',
        })
    )

    class Meta:
        model = Student
        fields = ['name', 'email', 'age', 'course']

        widgets = {
            'name': forms.TextInput(attrs={
                'placeholder': 'Enter student name'
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'Enter email address'
            }),
            'age': forms.NumberInput(attrs={
                'placeholder': 'Enter age'
            }),
        }