const socket = io()

const formMessage = document.querySelector("#form-message")
const shareLocationBtn = document.querySelector("#share-location-btn")

formMessage.addEventListener("submit", e => {
    e.preventDefault() // prevent page refreshing after submit
    const userMessage = e.target.elements.message.value //document.querySelector("#user-message-input").value
    socket.emit("sendMessage", userMessage)
})

shareLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.")
    }
    // share user location
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        socket.emit("shareLocation", { latitude, longitude })
    })
})


socket.on("spreadMessage", msg => {
    console.log('message received :>> ', msg);
})

socket.on("message", msg => {
    console.log(msg)
})
