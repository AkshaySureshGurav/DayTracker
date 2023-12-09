// import getCsrfToken from "./getCsrfToken";
// cons

document.addEventListener("DOMContentLoaded", () => {  
    
    const root = document.documentElement;
    
    const changeViewBtn = document.getElementById("ChangeView");
    let abortController = null; 

    fetch("/getNightMode")
    .then(response => response.json())
    .then(data => {
        if (data["status"] === "OK") {
            if (data["isNightModeOn"]) {
                changeViewBtn.previousElementSibling.innerText = "Day";
                changeViewBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`
                root.style.setProperty('--bgColor', '#030200');
                root.style.setProperty('--fontColor', 'white');
                root.style.setProperty('--shadow', '#f8cc5d');
                root.style.setProperty('--taskColor', '#131313');
                root.style.setProperty('--secondary-color', '#191919');
                root.style.setProperty('--menu-button', '#f8cc5d');
                root.style.setProperty('--hovered-menu-button', 'black');
                root.style.setProperty('--dialog-backdrop', 'none');
            } else {
                console.log("Already day mode is on")
            }
        }
    })


    const toggleAddTaskFormToggler = document.getElementById("toggleAddTaskFormToggler");
    const addTaskForm = document.getElementById('addTaskForm');

    const dialog = document.querySelector("dialog");


    const changeTaskLayout = document.getElementById("changeTasksLayout");

    changeTaskLayout.addEventListener("change", getTask);


    // Create an instance of AbortController
    // const abortController = new AbortController();

    // Get the signal from the controller
    
    
    
    changeViewBtn.addEventListener('click', function() {
        const bgColor = getComputedStyle(root).getPropertyValue("--bgColor");
        let conditionForUpdateRequest; // 1 is dayMode and 0 is nightMode

        

        if (bgColor === `#fdf1d3`) {
            conditionForUpdateRequest = 0;
            changeViewBtn.previousElementSibling.innerText = "Day";
            changeViewBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`
            root.style.setProperty('--bgColor', '#030200');
            root.style.setProperty('--fontColor', 'white');
            root.style.setProperty('--shadow', '#f8cc5d');
            root.style.setProperty('--taskColor', '#131313');
            root.style.setProperty('--secondary-color', '#191919');
            root.style.setProperty('--menu-button', '#f8cc5d');
            root.style.setProperty('--hovered-menu-button', '#000000');
            root.style.setProperty('--dialog-backdrop', 'none');
        } else {
            conditionForUpdateRequest = 1
            changeViewBtn.previousElementSibling.innerText = "Night";
            changeViewBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`
            root.style.setProperty('--shadow', 'black');
            root.style.setProperty('--bgColor', '#fdf1d3');
            root.style.setProperty('--fontColor', '#000000');
            root.style.setProperty('--taskColor', '#f8cc5d');
            root.style.setProperty('--secondary-color', '#fee8af');
            root.style.setProperty('--menu-button', '#000000');
            root.style.setProperty('--hovered-menu-button', '#f8cc5d');
            root.style.setProperty('--dialog-backdrop', 'rgba(0, 0, 0, 0.5)');    
        }

        const token = getCsrfToken("addTaskForm")
        fetch("/getNightMode", {
            method: "UPDATE",
            headers: {
                // 'Content-Type': 'application/json',
                'X-CSRFToken': token, // Add the CSRF token to the request headers
            },
            body: JSON.stringify({
                "isNightMode": conditionForUpdateRequest === 1 ? false : true
            })
        })
        .then(response => {
            if (!response.ok) {
                console.error("Response not OK")
                throw new Error("Error happened while connecting or from server side");
            }
            return response.json()
        })
        .then(data => {
            console.log(data)
        })
    });


    document.getElementById('menu').addEventListener('change', function() {
        const myDiv = document.getElementById('navAndTaskHolder');
        if (this.checked) {
            myDiv.style.pointerEvents = 'none';
            myDiv.style.opacity = '0.15'; // Optional: reduce opacity to show it's disabled
        } else {
            myDiv.style.pointerEvents = 'auto';
            myDiv.style.opacity = '1'; // Restore full opacity
        }
    });
    
    // const showButton = document.querySelector("dialog + button");
    // const closeButton = document.querySelector("dialog button");

    // "Show the dialog" button opens the dialog modally
    // showButton.addEventListener("click", () => {
    // dialog.showModal();
    // });

    // "Close" button closes the dialog
    // closeButton.addEventListener("click", () => {
    //     dialog.close();
    // });

    // const deleteTaskBtns = document.querySelectorAll(".deleteTaskBtn")
    const tasksHolder = document.getElementById("tasksHolder");
    tasksHolder.addEventListener("click", (event) => { 
        console.log(event.target)
        if (event.target.classList.contains("deleteTaskBtn")) {
            alert("deleteTaskBtn")
            actionAgainstTask(event.target, 0);
        } else if (event.target.classList.contains("completeTaskBtn")) {
            alert("Complete task")
            actionAgainstTask(event.target, 1)
        } else {
            console.error("Didn't recognise the button clicked")
        }
    });
     
    toggleAddTaskFormToggler.addEventListener("click", () => {
        addTaskForm.style.display = (addTaskForm.style.display === "block") ? "none" : "block";
        toggleAddTaskFormToggler.style.transform = (addTaskForm.style.display === "block") ? "rotate(45deg)" : "rotate(0deg)";
    })

    addTaskForm.addEventListener("submit", (e) => {
        e.preventDefault()
        token = getCsrfToken("addTaskForm")
        const inputElement = addTaskForm.querySelector("input[name='task']").value;
        const priorityOfTask = addTaskForm.querySelector("select[name='priority']").value;
        console.log(Number(priorityOfTask))
        addTaskForm.querySelector("input[name='task']").value = ''; 
        fetch("/addTask", {
            method: "POST",
            headers: {
                // 'Content-Type': 'application/json',
                'X-CSRFToken': token, // Add the CSRF token to the request headers
            },
            body: JSON.stringify({
                "task": inputElement, 
                "priority": priorityOfTask
            })
        })
        .then(response => {
            if (!response.ok) {
                console.error("Response not OK")
                throw new Error("Error happened while connecting or from server side");
            }
            return response.json()
        })
        .then(data => {
            if (data["status"] === "OK") {
                alertMessage(true)
                // console.log(JSON.parse(data.data))
                const newTaskData =  JSON.parse(data.data)
                console.log(newTaskData)
                const tasksHolder = document.getElementById("tasksHolder");
                const newTask = document.createElement("section")
                newTask.classList.add('task');
                newTask.innerHTML = `
                    <section style="width: 70%;">
                        <p>${newTaskData['task']}</p>
                        <p style="font-size: 0.85em;" class="priorityPara">Priority: <span style="display:block; height : 1em; width: 1em; border-radius: 17px; background-color: ${(newTaskData['priority'] === 1) ? ('blue') : ((newTaskData['priority'] === 2) ? "green" : "red") };"></span></h6>
                        <p style="font-size: 0.85em;">Created on ${newTaskData['date']}</p>
                    </section> 
                `;
                newTask.id=`task-${newTaskData['id']}`

                // const deleteBtn = document.createElement("button");
                // const completeBtn = document.createElement("button");
                const actionButtonHolder = document.createElement("section");
                actionButtonHolder.classList.add("d-flex", "justify-content-end", "flex-wrap")

                actionButtonHolder.innerHTML = `
                    <button style="background-color: #c6ffc5; border: 1px solid #02cd00;" class="taskActionBtn completeTaskBtn" id="${newTaskData['id']}">
                        <i style="color: #02cd00;" class="fa-solid fa-check"></i>
                    </button>
                    <button style="background-color: #ffd6d1; border: 1px solid #ee1800;" class="taskActionBtn deleteTaskBtn" id="${newTaskData['id']}">
                        <i style="color: #ee1800;" class="fa-solid fa-trash"></i>
                    </button>
                `;
                
                newTask.appendChild(actionButtonHolder);

                tasksHolder.appendChild(newTask);
                addRemoveMessageOfPendingTaskHolder();
            } else {
                alertMessage(false)
                console.log("Task creation error")
            }
        }).catch(error => console.error(error))
    })    


    function getCsrfToken(formID) {
        const form = document.querySelector(`#${formID}`);
        if (form) {
            const csrfTokenInput = form.querySelector("input[name='csrfmiddlewaretoken']");
            if (csrfTokenInput) {
                return csrfTokenInput.value;
            }
        }
        return null; // Return null if the form or CSRF token is not found
    }


    function createButton(innerTextValue, classes, btnId) {
        const newBtn = document.createElement("button");
        newBtn.innerText = innerTextValue;

        newBtn.classList.add(...classes)
        newBtn.id = btnId;
        return newBtn
    }


    

    // actionToProceedWith - 
    // 1 for marking the task as complete
    // 0 for deleting a task
    function actionAgainstTask(e, actionToProceedWith){
        console.log(`In actionAgainstTask ${e.id}`)
        
        const taskSection = document.getElementById(`task-${e.id}`);
        console.log(taskSection)
        const task = taskSection.querySelector('p').innerText
        console.log(task)
        const spanInDialog = dialog.querySelector("#dialogTask")
        

        // console.log(spanInDialog.innerText)
        if (actionToProceedWith === 0) {
            dialog.querySelector("#dialogBoxType").innerText = "delete the task";
        } else {
            dialog.querySelector("#dialogBoxType").innerText = "mark the task as complete";
        }
        
        dialog.showModal();
        spanInDialog.innerText = task;

        function dialogClickHandler(event) {
            let url, reqMethod;
            // console.log(event.target.id);
            // The below event is from btn click of dialog box 
            if (event.target.id === "yes") {
                const targetID = Number(e.id)
                if (actionToProceedWith === 0) {
                    console.log("Deleting task")
                    url= `/deleteTask/${Number(targetID)}`;
                    reqMethod = 'DELETE';
                } else if (actionToProceedWith === 1) {
                    console.log("Completing task")
                    url= `/completeTask/${Number(targetID)}`;
                    reqMethod = 'PATCH';
                } else {
                    console.error("Invalid arg provided for actionToProceedWith")
                }
                

                const token = getCsrfToken("deleteTaskForm");
        
                fetch(url, {
                    method: reqMethod,
                    headers: {
                        'X-CSRFToken': token, // Add the CSRF token to the request headers
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        console.error("Response not OK")
                        throw new Error("Error happened while connecting or from server side");
                    }
                    return response.json()
                })
                .then(data => {
                    if (data["status"] === "OK") {
                        taskOnDom = document.getElementById(`task-${targetID}`)
                        // // Check if the element exists before removing it
                        if (taskOnDom) {
                            taskOnDom.remove(); // Remove the element
                            const pendingCountHolder = document.getElementById(`pendingCount`)
                            const previousCountOfPendingTask = Number((pendingCountHolder.innerText).split(' ')[1]);
                            pendingCountHolder.innerText = `Pending: ${previousCountOfPendingTask-1}`
                            addRemoveMessageOfPendingTaskHolder();
                        } else {
                            console.error('Element not found');
                        }  
                    } else {
                        console.error("Unexpected response received from server")
                    }
                }).catch(error => {
                    console.error("Error occured while removing a task")
                })
            } else {
                console.log("Task action process cancelled because of no confirmation")
            }
            dialog.removeEventListener('click', dialogClickHandler); // Remove the event listener
            dialog.close();
        }

        dialog.addEventListener("click", dialogClickHandler)

    }



    function alertMessage(isError) {
        const message = document.getElementById("message")
        if (isError) {
            message.innerText = "Task added successfully"
            message.parentElement.style.backgroundColor = "green";
            message.parentElement.style.display = "flex";
        } else {
            message.innerText = "Error happened while adding task"
            message.parentElement.style.backgroundColor = "red";
            message.parentElement.style.display = "flex";
        }
    }


    function getTask(event) {
        // If there's an existing fetch request, abort it
        if (abortController) {
            abortController.abort();
        }

        // Create a new AbortController
        abortController = new AbortController();
        const signal = abortController.signal;
        
        const tasksHolder = document.getElementById("tasksHolder");
        tasksHolder.innerHTML = `
            <div class="lds-bars"><div></div><div></div><div></div></div>
        `;


        
        console.log(`Getting task layout for ${event.target.value}`)


        fetch(`/getTasks/${Number(event.target.value)}`, { signal })
        .then(response => {

            if (signal.aborted) {
                console.log('Fetch request aborted');
                return;
            }

            if (!response.ok) {
                console.error("Response not OK")
                throw new Error("Error happened while connecting or from server side");
            }
            return response.json()
        })
        .then(data => {
            if (signal.aborted) {
                console.log('Fetch request aborted');
                return;
            }

            if (data["status"] === "OK") {
                const responseData = JSON.parse(data["tasks"])
                console.log(responseData)
                
                tasksHolder.innerHTML = '';
                responseData.map(taskData => {
                    const task = document.createElement("section");
                    task.classList.add("task");
                    task.id = `task-${taskData['pk']}`
                    task.innerHTML = `
                        <section style="width: 70%;">
                            <h5>${(taskData['fields'])['task']}</h5>
                            <h6 class="priority">Priority: 
                                <span style="display:block; height : 1em; width: 1em; background-color: ${(taskData['fields'])['priority'] === 1 ? "blue" : (taskData['fields'])['priority'] === 2 ? "green" : "red"};"></span>
                            </h6>   
                            <h6>Created on ${(taskData['fields'])['creationDate']}</h6>
                        </section>
                        <section class="d-flex justify-content-end flex-wrap">
                            <button style='background-color: #c6ffc5; border: 1px solid #02cd00;' class="taskActionBtn completeTaskBtn" id="${taskData['pk']}">
                                <i style='color: #02cd00;' class="fa-solid fa-check"></i>
                            </button>   
                            <button style='background-color: #ffd6d1; border: 1px solid #ee1800;' class="taskActionBtn deleteTaskBtn" id="${taskData['pk']}">
                                <i  style='color: #ee1800;' class="fa-solid fa-trash"></i>
                            </button>
                        </section>
                    ` 
                    tasksHolder.appendChild(task)
                })
                console.log("Success")
            } else {
                console.error("Unexpected response received from server")
            }
        }).catch(error => {
            if (signal.aborted) {
                console.log('Fetch request aborted');
                return;
            }

            console.error("Error in getTask request ===> " + error);
        })
    }

    function addRemoveMessageOfPendingTaskHolder(){
        const tasksHolder = document.getElementById("tasksHolder");
        const containsTask = (tasksHolder.querySelectorAll('section.task')).length;
        if (containsTask === 0) {
            tasksHolder.innerHTML = `<h5 style="text-align: center; margin-top: 12%;">No pending task</h5>`
        } else {
            messageElement = tasksHolder.querySelector('h5')
            if (messageElement) {
                // Remove the selected h5 element
                messageElement.remove()
              } else {
                console.log('No h5 element found within tasksHolder');
              }
        }
    }
});