const users = []

const addUser = ({ id, username, room }) => {
    // clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate data
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
    return user
}

const removeUser = id => {
    const removedUserIndex = users.findIndex(user => user.id === id)

    if (removedUserIndex === -1) {
        return { error: `User with id:${id} is not defined.` }
    }

    return users.splice(removedUserIndex, 1)[0]
}



// TESTS
const user1 = {
    id: 21,
    username: "Den",
    room: "  Home"
}

const user2 = {
    id: 22,
    username: "Den2",
    room: "  Home"
}


const testAddUser = addUser(user1)
const testAddUser2 = addUser(user2)
const testRemoveUser1 = removeUser(21)
const testRemoveUser2 = removeUser(22)

console.log('testAddUser :>> ', testAddUser);
console.log('testAddUser2 :>> ', testAddUser2);
console.log('testRemoveUser1 :>> ', testRemoveUser1);
console.log('testRemoveUser2 :>> ', testRemoveUser2);
console.log('users :>> ', users);