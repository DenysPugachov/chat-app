const socket = io()

const formMessage = document.querySelector("#form-message")


formMessage.addEventListener("submit", e => {
    e.preventDefault() // prevent page refreshing after submit
    const userMessage = e.target.elements.message.value //document.querySelector("#user-message-input").value
    socket.emit("sendMessage", userMessage)
})

socket.on("spreadMessage", msg => {
    console.log('message received :>> ', msg);
})

socket.on("message", msg => {
    console.log(msg)
})
