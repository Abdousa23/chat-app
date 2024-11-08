document.addEventListener('DOMContentLoaded', async () => {
    const socket = io('http://localhost:3000', {
        withCredentials: true,
    });
    const activity = document.querySelector('.activity');
    const msgInput = document.querySelector('#message');
    const nameInput = document.querySelector('#name');
    const chatRoom = document.querySelector('#room');
    const userList = document.querySelector('.user-list');
    const roomList = document.querySelector('.room-list');
    const chatDisplay = document.querySelector('.chat-display');
    let currentRoom = null;

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    // Fetch rooms from backend
    async function fetchRooms() {
        try {
            const response = await fetch('http://localhost:3000/api/rooms');
            const rooms = await response.json();
            console.log(rooms);
            populateRoomList(rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    }

    // Populate room list
    function populateRoomList(rooms) {
        chatRoom.innerHTML = '<option value="" disabled selected>Select a room</option>';
        rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room._id; // Use room ID as the value
            option.textContent = room.roomName;
            chatRoom.appendChild(option);
        });
    }

    function sendMessage(e) {
        e.preventDefault();

        if (nameInput.value && msgInput.value && chatRoom.value) {
            socket.emit("send_message", {
                name: nameInput.value,
                text: msgInput.value,
                room: chatRoom.value,
            });
            msgInput.value = '';
        }
        msgInput.focus();
    }

    async function enterRoom(e) {
        e.preventDefault();
        if (nameInput.value && chatRoom.value) {
            if (currentRoom !== chatRoom.value) {
                try {
                    const response = await fetch(`http://localhost:3000/api/rooms/${chatRoom.value}/join`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name: nameInput.value })
                    });
                    if (response.ok) {
                        socket.emit("join_room", {
                            name: nameInput.value,
                            room: chatRoom.value,
                        });
                        currentRoom = chatRoom.value;
                        await getHistory(); // Fetch and display messages after joining the room
                    } else {
                        console.error('Failed to join room');
                    }
                } catch (error) {
                    console.error('Error joining room:', error);
                }
            } else {
                console.log('Already in the room');
            }
        }
    }

    async function leaveRoom() {
        if (nameInput.value && chatRoom.value) {
            try {
                const response = await fetch(`http://localhost:3000/api/rooms/${chatRoom.value}/leave`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: nameInput.value })
                });
                if (response.ok) {
                    socket.emit("leave_room", {
                        name: nameInput.value,
                        room: chatRoom.value,
                    });
                    currentRoom = null;
                } else {
                    console.error('Failed to leave room');
                }
            } catch (error) {
                console.error('Error leaving room:', error);
            }
        }
    }

    async function getHistory() {
        if (chatRoom.value) {
            try {
                const response = await fetch(`http://localhost:3000/api/rooms/${chatRoom.value}/messages`);
                const messages = await response.json();
                displayMessages(messages);
            } catch (error) {
                console.error('Error fetching message history:', error);
            }
        }
    }

    function displayMessages(messages) {
        chatDisplay.innerHTML = '';
        if (messages.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No messages in this room';
            chatDisplay.appendChild(li);
            return;
        } else {
            messages.forEach(data => {
                const { sender, messageContent: text, createdAt: time } = data;
                const name = sender.username;
                const li = document.createElement('li');
                li.className = 'post';
                if (name === nameInput.value) {
                    li.className = 'post post--left';
                }
                if (name !== nameInput.value && name !== 'Admin') {
                    li.className = 'post post--right';
                }
                if (name !== 'Admin') {
                    li.innerHTML = `<div class="post__header ${name === nameInput.value ? 'post__header--user' : 'post__header--reply'}">
                        <span class="post__header--name">${name}</span>
                        <span class="post__header--time">${time}</span>
                    </div>
                    <div class="post__text">${text}</div>`;
                } else {
                    li.innerHTML = `<div class="post__text">${text}</div>`;
                }
                chatDisplay.appendChild(li);
            });
        }
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    document.querySelector('.form-msg')
        .addEventListener('submit', sendMessage);

    document.querySelector('.form-join')
        .addEventListener('submit', enterRoom);

    document.querySelector('#leave')
        .addEventListener('click', leaveRoom);

    chatRoom.addEventListener('change', getHistory); // Fetch and display messages when a room is selected

    msgInput.addEventListener('keypress', () => {
        socket.emit('typing', { name: nameInput.value, room: chatRoom.value });
    });

    // Listen for messages from the server
    socket.on('receive_message', (data) => {
        activity.textContent = "";
        const { sender, messageContent: text, createdAt: time } = data;
        const name = sender.username;
        const li = document.createElement('li');
        li.className = 'post';
        if (name === nameInput.value) {
            li.className = 'post post--left';
        }
        if (name !== nameInput.value && name !== 'Admin') {
            li.className = 'post post--right';
        }
        if (name !== 'Admin') {
            li.innerHTML = `<div class="post__header ${name === nameInput.value ? 'post__header--user' : 'post__header--reply'}">
                <span class="post__header--name">${name}</span>
                <span class="post__header--time">${time}</span>
            </div>
            <div class="post__text">${text}</div>`;
        } else {
            li.innerHTML = `<div class="post__text">${text}</div>`;
        }
        chatDisplay.appendChild(li);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    });

    socket.on('typing_status', (data) => {
        activity.textContent = `${data.name} is typing...`;
        setTimeout(() => {
            activity.textContent = '';
        }, 3000);
    });

    socket.on('user_joined', (data) => {
        activity.textContent = `${data.name} has joined the chat`;
        setTimeout(() => {
            activity.textContent = '';
        }, 3000);
    });

    socket.on('user_left', (data) => {
        console.log('left');
        activity.textContent = `${data.name} has left the chat`;
        setTimeout(() => {
            activity.textContent = '';
        }, 3000);
    });

    // Fetch and populate rooms on load
    await fetchRooms();
});