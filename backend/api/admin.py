from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import User, Assignment, Submission, Book, CalendarEvent

class UserAdmin(DefaultUserAdmin):
    list_display = ('id', 'fullname', 'username', 'role', 'gender', 'birthday_date')
    search_fields = ('fullname', 'username')
    list_filter = ('role', 'gender')

class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'teacher', 'deadline')
    search_fields = ('title',)
    list_filter = ('teacher',)

class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'assignment', 'student', 'submitted_at', 'grade', 'attempt')
    search_fields = ('assignment__title', 'student__fullname')
    list_filter = ('assignment',)

class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'subject', 'uploaded_by')
    search_fields = ('title', 'subject')
    list_filter = ('subject',)

class CalendarEventAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'event_type', 'start_time', 'end_time', 'created_by')
    search_fields = ('title',)
    list_filter = ('event_type',)

admin.site.register(User, UserAdmin)
admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(Submission, SubmissionAdmin)
admin.site.register(Book, BookAdmin)
admin.site.register(CalendarEvent, CalendarEventAdmin)
