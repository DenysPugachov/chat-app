const socket = io()

const formMessage = document.querySelector("#form-message")
const shareLocationBtn = document.querySelector("#share-location-btn")

formMessage.addEventListener("submit", e => {
    e.preventDefault() // prevent page refreshing after submit
    const userMessage = e.target.elements.message.value //document.querySelector("#user-message-input").value

    // Last arg: cb() => acknowledgement event for server
    socket.emit("sendMessage", userMessage, (isContainProfanity) => {
        if (isContainProfanity) {
            console.error(isContainProfanity)
        }
        console.log("This message was delevered.")
    })
})

shareLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.")
    }
    // share user location
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        socket.emit("shareLocation", { latitude, longitude }, () => {
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
