
const socket = io()

const $messageForm = document.querySelector("#message-form")
const $shareLocationBtn = document.querySelector("#share-location-btn")
const $messageSendBtn = document.querySelector("#message-send-btn")
const $messageFormInput = document.querySelector("#message-input")

// Mustache templates
const $messageTemplate = document.getElementById('message-template').innerHTML;
const $messages = document.getElementById("messages")

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
        console.log("Sended :>>", userMessage)
    })
})

$shareLocationBtn.addEventListener("click", () => {
    $shareLocationBtn.setAttribute("disabled", "disabled")

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.")
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
    console.log("Received :>>", msg)
})


// Use Mustache templeate lib to render the message
function renderMessage(message) {
    const messageHTML = Mustache.render($messageTemplate, { message });
    $messages.insertAdjacentHTML("beforeend", messageHTML)
}


// Event acknowledgement: [ игнолэджмент ] => признание, подтверждение события
// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (receive) --acknowledgement -> client 
