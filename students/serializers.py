
from rest_framework import serializers
from .models import Student, Course, Trainer
import re


class StudentSerializer(serializers.ModelSerializer):

    def validate_name(self, value):
        if not re.fullmatch(r"[A-Za-z ]+", value.strip()):
            raise serializers.ValidationError(
                "Name can contain only letters and spaces."
            )
        return value.strip()

    def validate_email(self, value):
        if not re.fullmatch(r"[A-Za-z0-9._%+-]+@gmail\.com", value.strip()):
            raise serializers.ValidationError(
                "Email must be a valid Gmail address ending with @gmail.com."
            )
        return value.strip()

    def validate_phone(self, value):
        phone = str(value)

        if not re.fullmatch(r"[0-9]{10}", phone):
            raise serializers.ValidationError(
                "Phone number must contain exactly 10 digits."
            )
        return phone

    def validate_age(self, value):
        if value < 15 or value > 100:
            raise serializers.ValidationError(
                "Age must be between 15 and 100."
            )
        return value

    class Meta:
        model = Student
        fields = '__all__'


class TrainerSerializer(serializers.ModelSerializer):

    def validate_name(self, value):
        if not re.fullmatch(r"[A-Za-z ]+", value.strip()):
            raise serializers.ValidationError(
                "Trainer name can contain only letters and spaces."
            )
        return value.strip()

    def validate_email(self, value):
        if not re.fullmatch(r"[A-Za-z0-9._%+-]+@gmail\.com", value.strip()):
            raise serializers.ValidationError(
                "Email must be a valid Gmail address ending with @gmail.com."
            )
        return value.strip()

    def validate_phone(self, value):
        phone = str(value)

        if not re.fullmatch(r"[0-9]{10}", phone):
            raise serializers.ValidationError(
                "Phone number must contain exactly 10 digits."
            )
        return phone

    class Meta:
        model = Trainer
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = '__all__'
