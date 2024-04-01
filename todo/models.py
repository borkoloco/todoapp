from django.db import models
from django.utils import timezone

# Create your models here.

class Todo(models.Model):
    task = models.CharField(max_length = 200)
    completed = models.BooleanField(default = False)
    created_at = models.DateTimeField(default = timezone.now)
    due_at = models.DateTimeField()

    def __str__(self):
        return self.task
    
