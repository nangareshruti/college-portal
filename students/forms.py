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
        fields = ['name', 'email', 'age', 'course', 'profile_image']

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

    def clean_name(self):
        name = self.cleaned_data.get('name', '').strip()

        if not name:
            raise forms.ValidationError("Name is required.")

        if not all(char.isalpha() or char.isspace() for char in name):
            raise forms.ValidationError(
                "Name must contain only letters and spaces."
            )

        return name

    def clean_age(self):
        age = self.cleaned_data.get('age')

        if age < 15 or age > 100:
            raise forms.ValidationError(
                "Age must be between 15 and 100."
            )

        return age