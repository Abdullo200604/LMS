from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from root import settings
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('ustoz', 'Ustoz'),  # noqa
        ('admin', 'Admin')
    ]
    GENDER_CHOICES = [
        ('erkak', 'Erkak'),  # noqa
        ('ayol', 'Ayol')  # noqa
    ]

    fullname = models.CharField(max_length=50, null=False)
    username = models.CharField(max_length=50, unique=True, null=False)
    birthday_date = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=False)
    address = models.CharField(max_length=50, null=False)
    temporarily_address = models.CharField(max_length=100, null=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.fullname
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'


class Assignment(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    file = models.FileField(upload_to='assignments/', blank=True, null=True)
    deadline = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    teacher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assignments')

    def __str__(self):
        return self.title

class Submission(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    file = models.FileField(upload_to='submissions/')
    submitted_at = models.DateTimeField(auto_now_add=True)
    grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True, null=True)
    attempt = models.PositiveSmallIntegerField(default=1)

    def __str__(self):
        return f"{self.assignment.title} - {self.student.fullname}"

class Book(models.Model):
    title = models.CharField(max_length=255)
    subject = models.CharField(max_length=100)
    file = models.FileField(upload_to='books/')
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_books')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class CalendarEvent(models.Model):
    EVENT_TYPE_CHOICES = [
        ('lesson', 'Dars'),
        ('assignment_deadline', 'Topshiriq dedlayni'),
        ('exam', 'Imtihon'),
        ('other', 'Boshqa')
    ]
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    event_type = models.CharField(max_length=32, choices=EVENT_TYPE_CHOICES, default='lesson')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)
    # optional: specific group or user
    for_group = models.CharField(max_length=100, blank=True, null=True)  # masalan, "10A" yoki "All"

    def __str__(self):
        return f"{self.title} ({self.get_event_type_display()})"