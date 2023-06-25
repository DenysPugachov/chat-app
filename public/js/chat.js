
const socket = io()
// Elements
const $messageForm = document.querySelector("#message-form")
const $shareLocationBtn = document.querySelector("#share-location-btn")
const $messageSendBtn = document.querySelector("#message-send-btn")
const $messageFormInput = document.querySelector("#message-input")

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
        console.log("This message was delevered.")
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
    console.log('message received :>> ', msg);
})

socket.on("message", msg => {
    console.log(msg)
})


// Event acknowledgement: [ игнолэджмент ] => признание, подтверждение события
// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (receive) --acknowledgement -> client 
