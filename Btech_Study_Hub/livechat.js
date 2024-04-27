window.onload = function() {
    const chatDisplay = document.getElementById('chat-display');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const leaveButton = document.getElementById('leave-button');

    // Check if the user has already joined the chat
    const hasJoinedChat = localStorage.getItem('hasJoinedChat');
    if (hasJoinedChat) {
        showChatRoom();
    }

    function displayMessage(name, message, isUserMessage) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');

        // Create a span element for the name and message content
        const nameSpan = document.createElement('span');
        nameSpan.textContent = `${name}: `;
        messageElement.appendChild(nameSpan);

        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        messageElement.appendChild(messageSpan);

        // Add appropriate class based on user or other message
        if (isUserMessage) {
            messageElement.classList.add('user-message');
            addDeleteButton(messageElement, name, message); // Add delete button for user's own message
        } else {
            messageElement.classList.add('other-message');
        }

        // Append message element to chat display
        chatDisplay.appendChild(messageElement);
        chatDisplay.appendChild(document.createElement('br'));
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    function sendMessage() {
        const message = messageInput.value;
        const name = localStorage.getItem('userName');
        if (name && message.trim() !== '') {
            fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, message })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to send message');
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
            messageInput.value = '';
        }
    }

    function leaveChat() {
        const userName = localStorage.getItem('userName');
        if (userName) {
            const leaveMessage = `${userName} has left the chat`;
            displayMessage('Chat Room', leaveMessage, false);
            localStorage.removeItem('userName');
            localStorage.removeItem('hasJoinedChat'); // Remove the flag indicating the user has joined
            document.getElementById('chat-room').style.display = 'none';
            document.getElementById('name-input-container').style.display = 'block';
            document.getElementById('name-input').value = '';
        }
    }

    function showChatRoom() {
        const name = document.getElementById('name-input').value.trim();
        if (name !== '') {
            localStorage.setItem('userName', name);
            localStorage.setItem('hasJoinedChat', true); // Set flag indicating the user has joined
            document.getElementById('name-input-container').style.display = 'none';
            document.getElementById('chat-room').style.display = 'block';
            const joinMessage = `${name} has joined the chat`;
            displayMessage('Chat Room', joinMessage, false);
        } else {
            alert("Please enter your name.");
        }
    }

    // Function to add a delete button to the message element
    function addDeleteButton(messageElement, name, message) {
        const deleteButton = document.createElement('span');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Font Awesome trash icon
        deleteButton.classList.add('delete-button');
        deleteButton.style.cursor = 'pointer'; // Change cursor to pointer when hovering over the delete button
        deleteButton.addEventListener('click', () => {
            deleteMessageFromDatabase(name, message); // Call function to delete message from database
            messageElement.remove(); // Remove message element from chat display
        });
        messageElement.appendChild(deleteButton);
    }

    function deleteMessageFromDatabase(name, message) {
        // Send request to server to delete the message from the database
        fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, message })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete message from database');
            }
        })
        .catch(error => {
            console.error('Error deleting message from database:', error);
        });
    }

    sendButton.addEventListener('click', sendMessage);
    document.getElementById('join-button').addEventListener('click', showChatRoom);
    document.getElementById('leave-button').addEventListener('click', leaveChat);

    function getMessages() {
        fetch('/chat')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to retrieve messages');
            }
            return response.json();
        })
        .then(messages => {
            chatDisplay.innerHTML = '';
            messages.forEach(message => {
                displayMessage(message.name, message.message, message.name === localStorage.getItem('userName'));
            });
        })
        .catch(error => {
            console.error('Error retrieving messages:', error);
        });
    }

    getMessages();
    setInterval(getMessages, 5000); // Poll the server every few seconds to check for new messages
};
