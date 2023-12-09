document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    fetch("/getNightMode")
    .then(response => response.json())
    .then(data => {
        if (data["status"] === "OK") {
            if (data["isNightModeOn"]) {
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




    const date = document.getElementById("dateValue");

    date.addEventListener("change", (e) => {
        // alert("date changed")
        // console.log(e.currentTarget.value)
        const requestDate = e.currentTarget.value
        fetch(`/getLog/${requestDate}`)        
        .then(response => {
            if (!response.ok) {
                console.error("Response not OK")
                throw new Error("Error happened while connecting or from server side");
            }
            return response.json()
        }).then(data => {

            console.log(data)
            const pendingTaskHolder = document.getElementById("logsPendingTasksHolder");
            pendingTaskHolder.innerHTML = ''
            document.getElementById("logsPageHead").innerText = `of ${data["dateRequested"]}`;

            if (data.hasOwnProperty("data")) {
                const pendingTasks = JSON.parse((data["data"])["tasks"])
                // console.log(requestDate)
                // document.getElementById("logsPageHead").innerText = `Viewing logs of ${(data["data"])["requestedDate"]}`

                
                // console.log(pendingTaskHolder)

                // console.log(data["data"].hasOwnProperty("log"))
                const log = document.createElement("section") 
                log.id = 'noteForLogPage'

                if (data["data"].hasOwnProperty("log")){

                    // also enabling the edit mode if the requested date is today's date
                    log.innerHTML = `<h5 style="text-align: center;">${(data["data"])["isrequestedDateTodayDate"] ? "Today's status": "Status of that day"}</h5><p style="margin: 0; text-align: center">${(data["data"])["log"]}</p>${(data["data"])["isrequestedDateTodayDate"] ? "<a href='/updateToday'><i class='fa-regular fa-pen-to-square'></i>edit</a>" : ""}`;
                    

                } else {
                   

                    // also enabling the edit mode if the requested date is today's date
                    log.innerHTML = `Daily log was not updated`
                }
                pendingTaskHolder.appendChild(log)
                console.log(pendingTaskHolder)


                if (pendingTasks.length > 0) {

                    const table = document.createElement('table');
                    table.innerHTML = `<tr>
                            <th>Task</th>
                            <th>Status</th>
                        </tr>`
                    
                    pendingTasks.forEach(taskData => {
                        const task = taskData["fields"]
                        const tr = document.createElement('tr')
                        tr.classList.add(task["isCompleted"] ? "completed" : "pending")
                        const td1 = document.createElement('td')    
                        const td2 = document.createElement('td')    
                        td1.innerText = task["task"]
                        td2.innerText = (task["isCompleted"]) ? `Completed on ${(task["completionDate"] === task["creationDate"]) ? "same day of creation" : task["completionDate"]}` : "Still pending";
                        tr.appendChild(td1)
                        tr.appendChild(td2)
                        table.appendChild(tr)
                    });
                    
                    pendingTaskHolder.appendChild(table)
                } else {
                    const h5tag = document.createElement('h5');
                    if (data["data"]["isrequestedDateTodayDate"]) {
                        h5tag.innerText = "No tasks are created or completed yet"
                    } else {
                        h5tag.innerText = "No task was created or completed"
                    }
                    pendingTaskHolder.appendChild(h5tag);

                }

            } else {
                pendingTaskHolder.innerHTML = `<h5>No log/task was created.</h5>`
            }

        }).catch(err => console.error(err))
    })
})