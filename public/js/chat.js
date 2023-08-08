const socket = io()

const $messageForm = document.querySelector("#message-form")
const $shareLocationBtn = document.querySelector("#share-location-btn")
const $messageSendBtn = document.querySelector("#message-send-btn")
const $messageFormInput = document.querySelector("#message-input")
const $messages = document.getElementById("messages")

// Mustache templates
const $messageTemplate = document.getElementById('message-template').innerHTML;
const $locationTemplate = document.getElementById('location-message-template').innerHTML;
const $sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Options 
// parse data from the url(querystring) to object
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

$messageFormInput.focus()

$messageForm.addEventListener("submit", e => {
    e.preventDefault()

    $messageSendBtn.setAttribute("disabled", "enabled")

    const userMessage = e.target.elements.message.value

    // Last arg: cb() => acknowledgement event for server
    socket.emit("sendMessage", userMessage, (profanity) => {
        $messageSendBtn.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if (profanity) {
            console.error(profanity)
        }
    })
})

$shareLocationBtn.addEventListener("click", () => {
    $shareLocationBtn.setAttribute("disabled", "disabled")

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.")
    }

    if (!window.navigator.onLine) {
        socket.emit("shareLocation", {
            latitude: 0.0000,
            longitude: 0.00000
        }, () => {
            $shareLocationBtn.removeAttribute("disabled")
            console.log("Offline location shared!")
        })
    }

    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        socket.emit("shareLocation", { latitude, longitude }, () => {
            $shareLocationBtn.removeAttribute("disabled")
            console.log("Location shared!")
        })
    })
})


socket.on("spreadMessage", msg => {
    console.log('Spreaded :>> ', msg);
})

socket.on("message", msg => {
    renderMessage(msg)
    console.log("Received :>>", msg.text)
})

socket.on("shareLocation", locationObj => {
    renderLocationMessage(locationObj)
    console.log("Received :>>", locationObj)
})

socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render($sidebarTemplate, {
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML = html
})


// Use Mustache templeate lib to render the message
function renderMessage(message) {
    const messageHTML = Mustache.render($messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("hh:mm:ss")
    });
    $messages.insertAdjacentHTML("beforeend", messageHTML)
}

function renderLocationMessage(locationObj) {
    const html = Mustache.render($locationTemplate, {
        username: locationObj.username,
        locationUrl: locationObj.url,
        createdAt: moment(locationObj.createdAt).format("hh:mm:ss")
    });
    $messages.insertAdjacentHTML("beforeend", html)
}

// function renderSidebar({ room, usersInRoom }) {
//     const html = Mustache.render($sidebarTemplate, {
//         room,
//         usersInRoom
//     })
//     $chatSidebar.insertAdjacentHTML("beforeend", html)
// }

//emit an event when someone join the specific room
socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/" // redirect to join page
    }
})
