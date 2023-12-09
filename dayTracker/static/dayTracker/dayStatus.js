document.addEventListener("DOMContentLoaded", () => {


    const root = document.documentElement;
    const dayStatusForm = document.getElementById("statusUpdate");

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


    const clearBtn = document.getElementById("clearBtn");
    clearBtn.addEventListener("click", () => {
        document.getElementById("textInput").value = ''
    })



    document.getElementById("statusUpdate")
    dayStatusForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(e.currentTarget)
        var inputValue = document.getElementById('textInput').value;

        const token = getCsrfToken("statusUpdate");
        
        fetch("/updateToday", {
            method: "POST",
            headers: {
                // 'Content-Type': 'application/json',
                'X-CSRFToken': token, // Add the CSRF token to the request headers
            },
            body: JSON.stringify({
                "status": inputValue
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
            alertMessage(data)
        })
        .catch(error => console.log(error))
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

    function alertMessage(jsonResponse) {
        const message = document.getElementById("message")
        if (jsonResponse["status"] === "OK") {
            message.innerText = "Status updated successfully"
            message.parentElement.style.backgroundColor = "green";
            message.parentElement.style.display = "block";
        } else {
            message.innerText = "Error happened while updating status"
            message.parentElement.style.backgroundColor = "red";
            message.parentElement.style.display = "block";
        }
    }
})