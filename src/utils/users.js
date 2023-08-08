const users = []

const addUser = ({ id, username, room }) => {
    // username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: "User name and room are required!"
        }
    }

    // check for existing user
    const isUserExist = users.find(user => {
        return user.username === username && user.room === room
    })

    if (isUserExist) {
        return { error: `User name ${username} is already taken.` }
    }

    // store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = id => {
    const removedUserIndex = users.findIndex(user => user.id === id)

    if (removedUserIndex === -1) {
        return { error: `User with id:${id} is not defined.` }
    }

    return users.splice(removedUserIndex, 1)[0]
}

const getUser = id => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = room => {
    if (room) {
        // room = room.trim().toLowerCase()
        return users.filter(user => user.room === room)
    }
    console.log("room is", room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}