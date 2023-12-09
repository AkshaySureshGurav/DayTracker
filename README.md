# DayTracker: our personal task management and daily progress tracker
[Demo Video](https://youtu.be/yrpnR6bUczE?si=MGWJrrLSLJJ7Y2l0)


## Table of Contents
1. [Description](#description)
2. [Main features](#main-features)
3. [Distinctiveness and complexity](#distinctiveness-and-complexity)
4. [Things I got to know](#things-i-got-to-know)
5. [About project files](#about-project-files)
6. [Setup and installation](#setup-and-installation)
7. [How to run](#how-to-run)

## Description
Basically, it is a task manager app in which the user will also be able to update their daily status like a log, track those status and tasks. Anyone who likes to keep the track a record of his task and their completion then dayTracker is for you.

## Main features
### 1. Task Management: 
On the main(default) page, the user have an option to add task with an option of plus icon. After clicking that the user will be able to add task, once task is added the user will be able to see the task in a section below the adding task form. That section will contain a list of task depending on the number of pending task the user have. The user will have an option to mark the task as complete or delete that ask in the section itself.

### 2. Daily Log Updates
In addition to managing daily tasks, users can seamlessly update their daily logs to monitor and record their progress over time. This feature enables users to maintain a comprehensive record of their daily activities and achievements.

### 3. Accessing Logs and Task History
Users will have the capability to review their historical tasks and logs, providing a convenient way to revisit and check on their past activities.

### 4. Night mode
The user also have an option of change the type of view. Some user may like the web app with the daylight background or some with night/shady background. So we have an option of that too in this web app.

### 5. Intuitive and User-Friendly Interface
The web app have icons and persistent tooltips in order to make the user understand what action will be performed on click of a link or a button. This design choice enhances user understanding and interaction by providing visual cues for each clickable element.

## Distinctiveness and complexity:
### Why this project is distinct?
#### Distinct idea
The idea of this DayTacker web app itself is different from the assignment submitted in past whether it was search, wiki, commerce, mail and network. I came up with this idea because I myself keep a handsize book to keep the track to task which I have to do and which are completed. With this web app, the user will be able to do task management, daily log updatation, check his past logs and task data.

#### Concept which are distinct from previous assignments
1. Usage of abort handler in forIndex.js for preventing multiple request for sorting the tasks.

2. Night mode(dark mode), is a setting to make the user interface easier on the eyes in low-light environments. 

3. CSS custom properties.

4. Event delegation because a user can have multiple pending tasks and each task section in index.html file have 2 buttons to perform action against task. So having event listener for each of the button will slow down our javascript file execution.

5. Closures in forIndex.js.

6. Complex queries for retrieving data from model like this - ```tasks.objects.filter(Q(creationDate__date=d) | Q(completionDate__date=d))```.

7. Navbar on left-side if screen width is more than 500px, or else it will be on the bottom side. 



### Why this project is complex? 
#### Multiple event listening
1. Complexity:
On the main page, I have a task holder which holds the tasks added by the user and each task consist of 2 buttons which perform actions related to the task (action like task completion and task deletion). So the complexity here was that adding event listener for each of the action buttons would lead my javascript to listen to multiple events at a time which will impact the performance of my javscript execution.

2. Solution: 
So I came up idea of attaching an event listener to the common ancestor which is also called event delegation. When any of the action button is clicked then the event will be listened by the ancestor of that buttons and js file will be checking the event.target object to get to know for which task we are performing this action.

#### Dark mode
1. Complexity: 
When I change the CSS custom properties on one page and when I load another page the custom properties were changing and because of which the view was not as per the change on the main page.

2. Solution: 
So whenever the page is loaded, we will make a GET request to the server to check the view selected by the user. 

#### Multiple sections overlaying on top of event handlers
1. Complexity:
In order to make my project look good, I had the navbar to be visible on left side if the screen size is more than 500px or else it will on the bottom part. This was leading to multiple overlays which were on top the event handlers because of which the event handling was not done as expected. 

2. Solution: 
Switching the pointer-event property to none when need helped me to overcome this issue.

#### Navbar positioning basis on screen width

## Things I got to know
1. Event delegation - used in forIndex.js for event handling of index.html 

2. CSS Custom Properties - For changing the view to day mode to night mode, I just have to change to the custom Properties through the javascript if the night mode button is clicked.

3. Closures - For handling event for performing action against the task, a function called actionAgainstTask is defined which makes the dialog box visible and only after confirmation the action of task deletion or completion is executed. The event handler of the dialog box confirmation button click refers to the event object of the parent function named actionAgainstTask. So this is why closure was required.

4. pointer-event property in CSS.

5. Accessing root element from javascript file.

6. Inorder to be able to view and edit the Django model data of an app, registering the model name in admin.py file of the app where the model exist is essential. 

7. Complex queries for retrieving data from model like this - ```tasks.objects.filter(Q(creationDate__date=d) | Q(completionDate__date=d))```, the highlighted line basically filter the data of a model if any of the condition is satisfied.

8. Removing the event listeners when not needed can help our app to not execute unexpected code.

## About project files

### final/
This is the main directory containing our Django project. The name of this directory is usually the name of our project.

### manage.py
This is a command-line utility that lets you interact with our Django project in various ways, such as running development server, creating database tables, and more.

#### final/settings.py
This file contains settings for our Django project. You can configure database settings, time zone, static files, middleware, and other project-specific configurations here.

#### final/urls.py
This file contains the URL patterns for our project. It maps URLs to views and provides a way to organize and structure our application.

#### final/asgi.py and final/wsgi.py
These files are used for ASGI (Asynchronous Server Gateway Interface) and WSGI (Web Server Gateway Interface) setups, respectively. They provide the entry points for ASGI and WSGI servers to communicate with our Django application.

### requirements.txt
This file lists all the Python packages and their versions required for our project. It is often used with tools like pip to install dependencies.

### db.sqlite3 
Once after running the ```python manage.py makemigrations``` the db.sqlite3 will be created. This file stores the SQLite database for our project. The name might vary based on the database engine you're using.

### dayTracker/
This directory is where you organize our Django applications. Each app can have its own models, views, templates, and static files.

### dayTracker/static/
This directory is used to store static files such as CSS, JavaScript, and image files.

#### dayTracker/static/authenticationPage.js
This file contains javascript code for login.html and register.html.

#### dayTracker/static/dayStatus.js
This file contains javascript code for dayStatus.html.

#### dayTracker/static/favicon-32x32.png
For favicon icon for our web app.

#### dayTracker/static/forIndex.js
This file contains javascript code for our main page index.html.

#### dayTracker/static/forLogs.js
This file contains javascript code for logs.html.

### dayTracker/templates/
This directory is where you store our HTML templates.

#### dayTracker/templates/layout.html
This file contains html for page for updating day status.

#### dayTracker/templates/dayStatus.html
This file contains html for page for updating day status.

#### dayTracker/templates/index.html
This file contains html for our main page.

#### dayTracker/templates/login.html
This file contains html for our main page.

#### dayTracker/templates/logs.html
This file contains html for our logs page.

#### dayTracker/templates/register.html
This file contains html for registration page.

### dayTracker/migrations
It is where Django stores database migration files. Migrations are a way to version-control your database schema and apply changes over time.

### dayTracker/admin.py
This file is used to define the Django admin site configurations for the models defined in the models.py file. In admin.py, you can register your models to make them accessible and manageable through the Django admin interface. 

### dayTracker/apps.py
The apps.py file is used to configure the application and can include application-specific settings.

### dayTracker/models.py
This file is where you define the data models for your Django application. Each class in this file represents a table in the database, and each attribute of the class represents a field in the corresponding table. 

### dayTracker/urls.py
The urls.py file is used to define the URL patterns for your Django application. It contains a mapping between URL patterns and the corresponding views that should handle those patterns.

### dayTracker/views.py
In the views.py file, you define the views that handle HTTP requests. Views are functions or classes that process incoming requests and return appropriate HTTP responses. This file contains the logic for your application, handling user input, interacting with models, and rendering templates to generate the final response.

## Setup and installation
1. Clone the repository:
```git clone <repository_url>```

2. Change the working directory to cloned repository:   
```cd <repository_folder>```

3. Create a Virtual Environment: 
```python -m venv myenv```

4. Activate the Virtual Environment:
```source myenv/bin/activate``` (On windows - ```myenv\Scripts\activate```)

5. Install Dependencies: 
```pip install -r requirements.txt```

6. Make migrations
```python manage.py makemigrations```

6. Apply Migrations: 
```python manage.py migrate```

7. Run the Development Server: 
```python manage.py runserver```



## How to run
1. Change the working directory to the project directory.

2. Execute command ```python manage.py runserver``` to the host the web app on local host.


