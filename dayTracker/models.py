from django.db import models
from django.contrib.auth.models import User
from datetime import date
from django.core.validators import MaxValueValidator, MinValueValidator
# Create your models here.
class userModel(User):
    pass
    
    def __str__(self) -> str:
        return self.username

class tasks(models.Model):
    # taskId = models.AutoField(primary_key=False, null=True)
    user = models.ForeignKey(userModel, on_delete=models.CASCADE, related_name="pendingTasks")
    task = models.CharField(max_length=64)
    creationDate = models.DateField(null=True)
    isCompleted = models.BooleanField(default=False)
    completionDate = models.DateField(blank=True, null=True)
    priority = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(3)])

    def __str__(self) -> str:
        if self.isCompleted:
            return str(self.id) + ". " + self.user.username + " --> " + self.task + " is completed"
        else:
            return str(self.id) + ". " + self.user.username + " --> " + self.task + " is still pending with priority=" + str(self.priority)
    

class dayStatus(models.Model):
    user = models.ForeignKey(userModel, on_delete=models.CASCADE, related_name="dayStatus")
    log = models.CharField(max_length=150)
    logDate = models.DateField(default=date.today())


    def __str__(self) -> str:
        return str(self.user.username) + " --> " + self.log
    

class nightMode(models.Model):
    user = models.ForeignKey(userModel, on_delete=models.CASCADE, related_name="nightMode")
    isNightModeOn = models.BooleanField(default=False)

    def __str__(self) -> str:
        return str(self.user.username) + " --> " + str(self.isNightModeOn)


