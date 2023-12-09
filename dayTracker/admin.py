from django.contrib import admin

from .models import tasks, nightMode

admin.register(tasks)(admin.ModelAdmin)
admin.register(nightMode)(admin.ModelAdmin)