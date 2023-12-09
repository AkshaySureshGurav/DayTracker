# from django.http import HttpResponse
from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.db import IntegrityError
from django.db.models import Q

from .models import userModel, tasks, dayStatus, nightMode

from django.core import serializers

import datetime
import json
import time
# from django.core import serializers

@login_required(login_url="/login")
def index(request):
    viewer = request.user # viewer is the person visiting this page
    pendingTasksOfViewier = tasks.objects.filter(user=viewer, isCompleted=False)

    return render(request, 'dayTracker/index.html', {
        "numberOfTasks": pendingTasksOfViewier.count(),
        "viewerName": viewer.username, 
        "todayDate": datetime.date.today(), 
        "tasks": pendingTasksOfViewier
    })


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "dayTracker/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "dayTracker/login.html")
    

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "dayTracker/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = userModel.objects.create_user(username, email, password)
            user.save()
            viewModeOfUser = nightMode.objects.create(user=user)
            viewModeOfUser.save()
        except IntegrityError:
            return render(request, "dayTracker/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "dayTracker/register.html")
    
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def logs(request): 
    startDate = None
    endDate = None

    tasksList = tasks.objects.filter(user=request.user)
    userlogs = dayStatus.objects.filter(user=request.user)
    
    if (userlogs.count() > 0) and (tasksList.count() > 0):
        startDate= str(tasksList.first().creationDate) if (tasksList.first().creationDate < userlogs.first().logDate) else str(userlogs.first().logDate)
        endDate=str(tasksList.order_by('-creationDate')[:1].get().creationDate) if tasksList.order_by('-creationDate')[:1].get().creationDate > userlogs.order_by('-logDate')[:1].get().logDate else str(userlogs.order_by('-logDate')[:1].get().logDate)
    elif (userlogs.count() > 0) and (tasksList.count() == 0):
        startDate = str(userlogs.first().logDate)
        endDate = str(userlogs.order_by('-logDate')[:1].get().logDate)
    elif (userlogs.count() == 0) and (tasksList.count() > 0):
        startDate = str(tasksList.first().creationDate)
        endDate = str(tasksList.order_by('-creationDate')[:1].get().creationDate)
    else: 
        startDate = ''
        endDate = ''
    return render(request, "dayTracker/logs.html", {
        "startDate": startDate,
        "endDate": endDate
    })


def addTask(request):
    if request.method == "POST":
        requestBody = json.loads(request.body)
        requester = userModel.objects.get(username=request.user)
        todayDate=datetime.date.today()

        isTaskrepeated = tasks.objects.filter(Q(user=requester)& Q(task=requestBody['task'])).exists()


        if not isTaskrepeated:
            # do not get the id field in here
            t1 = tasks(user=requester, task=requestBody['task'], creationDate=todayDate, priority=requestBody['priority'])
            t1.save()

            # id is not received when called an entry with get
            # so we have to manually make a new dict
            newlySavedTask = tasks.objects.get(user=requester, task=requestBody['task'], creationDate=todayDate, priority=requestBody['priority'])
            returnValueDict = {
                "id": newlySavedTask.id,
                "task": newlySavedTask.task,
                "date": str(newlySavedTask.creationDate),
                "priority": newlySavedTask.priority
            }
            # print(returnValueDict)
            returnValueJson = json.dumps(returnValueDict, indent=2)

            return JsonResponse({
                "status": "OK",
                "data" : returnValueJson
            })

        else:
            print(requestBody['task'] + " already exists")

            return JsonResponse({
                "status": "notOK",
                "error" : "Already exists"
            })

    else:
        return JsonResponse({
            "status": "notOK",
            "error": "This endpoint only accepts POST requests"
        })
    
def deleteTask(request, taskID):
    taskToDelete = tasks.objects.get(id=taskID)
    taskToDelete.delete()
    return JsonResponse({
        "status": "OK"
    }) 

def completeTask(request, taskID):
    taskToMarkComplete = tasks.objects.get(id=taskID)
    taskToMarkComplete.completionDate = datetime.date.today()
    taskToMarkComplete.isCompleted = True
    taskToMarkComplete.save() 
    return JsonResponse({
        "status": "OK"
    })   



def updateDayStatus(request):
    requester = userModel.objects.get(username=request.user)
    statusOfTheDay = None
    try:
        statusOfTheDay = dayStatus.objects.get(logDate=datetime.date.today(), user=requester)
    except:
        print("Unable to find today's status")

    
    if request.method == "GET":
        if statusOfTheDay: 
            return render(request, "dayTracker/dayStatus.html", {
                "pastUpdatedTask": statusOfTheDay.log
            })
        else:
            return render(request, "dayTracker/dayStatus.html")
    else:

        reqBody = json.loads(request.body)
        print(not(reqBody["status"] == '') and not(reqBody["status"] == ' '))

        if not(reqBody["status"] == '') and not(reqBody["status"] == ' '):
            print("as")
            if statusOfTheDay: 
                statusOfTheDay.log = reqBody["status"]
                statusOfTheDay.save()
            else:
                s = dayStatus(user=requester, log=reqBody["status"], logDate=datetime.date.today())
                s.save()
            return JsonResponse({
                "status": "OK"
            })
        else: 
            print("sa")
            return JsonResponse({
                "status": "notOK"
            })


def getLog(request, reqDate):

    dateArray = reqDate.split('-')
    dateRequestedFor = datetime.date(int(dateArray[0]), int(dateArray[1]), int(dateArray[2]))
    
    requester = userModel.objects.get(username=request.user)
    
    allTasks = tasks.objects.filter(Q(user=requester)& Q(creationDate=dateRequestedFor) | Q(completionDate=dateRequestedFor))

    dayLog = None
    try:
        dayLog = dayStatus.objects.get(Q(user=requester)& Q(logDate=dateRequestedFor))
    except: 
        print("No log updated for requested date")


    if dayLog:
        return JsonResponse({
            "Status": "OK",
            "dateRequested": dateRequestedFor.strftime("%b. %d, %Y"),
            "data": {
                "tasks": serializers.serialize("json", allTasks),
                "log": dayLog.log,
                "isrequestedDateTodayDate": True if dateRequestedFor == datetime.date.today() else False
            }
        })
    else:
        # if we have task
        if allTasks.count() > 0:
            return JsonResponse({
                "Status": "OK",
                "dateRequested": dateRequestedFor.strftime("%b. %d, %Y"),
                "data": {
                    'isrequestedDateTodayDate': True if dateRequestedFor == datetime.date.today() else False, 
                    "tasks": serializers.serialize("json", allTasks)
                }
            })
        else:
            return JsonResponse({
                "Status": "OK",
                "dateRequested": dateRequestedFor.strftime("%b. %d, %Y"),
                "message": "No data to show"
            })
        



def getTasks(request, taskTypes):
    if 0 <= taskTypes < 5: 
        viewer = request.user # viewer is the person visiting this page

        match taskTypes:
            case 1:
                pendingTasksOfViewier = tasks.objects.filter(user=viewer, isCompleted=False).order_by("priority")
                return JsonResponse({
                    "status": "OK",
                    "tasks": serializers.serialize("json", pendingTasksOfViewier)
                })
            case 2:
                pendingTasksOfViewier = (tasks.objects.filter(user=viewer, isCompleted=False)).order_by("-priority")
                return JsonResponse({
                    "status": "OK",
                    "tasks": serializers.serialize("json", pendingTasksOfViewier)
                }) 
            case 3:
                tasksDateAscending = (tasks.objects.filter(user=viewer, isCompleted=False)).order_by("creationDate")
                return JsonResponse({
                    "status": "OK",
                    "tasks": serializers.serialize("json", tasksDateAscending)
                })
            case 4:
                tasksDateDescending = (tasks.objects.filter(user=viewer, isCompleted=False)).order_by("-creationDate")
                return JsonResponse({
                    "status": "OK",
                    "tasks": serializers.serialize("json", tasksDateDescending)
                })
            case _:
                pendingTasksOfViewier = tasks.objects.filter(user=viewer, isCompleted=False)
                return JsonResponse({
                    "status": "OK",
                    "tasks": serializers.serialize("json", pendingTasksOfViewier)
                })
    else:
        return JsonResponse({
            "status": "notOK"
        })
    
def getNightMode(request):

    if request.method == "UPDATE": 
        try: 
            requestBody = json.loads(request.body)
            userNightModeInstance = nightMode.objects.get(user=request.user)
            if requestBody["isNightMode"]:
                userNightModeInstance.isNightModeOn = True
            else:
                userNightModeInstance.isNightModeOn = False
            userNightModeInstance.save()
                
            return JsonResponse({
                "status": "OK"
            })
        except: 
            return JsonResponse({
                "status": "notOK"
            })
    else:
        night = None
        try: 
            object = nightMode.objects.get(user=request.user)
        except: 
            print("No enetry in nightMode model")
        # print(object.isNightModeOn)

        return JsonResponse({
            "status": "OK",
            'isNightModeOn':object.isNightModeOn
        })