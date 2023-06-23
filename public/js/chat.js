const socket = io()

socket.on("countUpdated", count => {
    console.log('chat.js receive countUpdated event.', `count: ${count}`);
})

document.querySelector("#increment").addEventListener("click", () => {
    socket.emit("incrementCount")
})

document.querySelector("#decrement").addEventListener("click", () => {
    socket.emit("decrementCount")
})