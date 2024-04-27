window.onload = function() {
  const chatDisplay = document.getElementById('chat-display');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const leaveButton = document.getElementById('leave-button');

  function displayMessage(name, message, isUserMessage) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.textContent = `${name}: ${message}`;
      if (isUserMessage) {
          messageElement.classList.add('user-message');
      } else {
          messageElement.classList.add('other-message');
      }
      chatDisplay.appendChild(messageElement);
      chatDisplay.appendChild(document.createElement('br'));
      chatDisplay.scrollTop = chatDisplay.scrollHeight;
  }

  function sendMessage() {
      const message = messageInput.value;
      if (message.trim() !== '') {
          const userName = localStorage.getItem('userName');
          const messageData = {
              name: userName,
              message: message
          };
          fetch('/messages', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(messageData)
          })
          .then(response => {
              if (response.ok) {
                  messageInput.value = '';
              }
          })
          .catch(error => {
              console.error('Error sending message:', error);
          });
      }
  }

  function fetchMessages() {
      fetch('/messages')
      .then(response => response.json())
      .then(messages => {
          messages.forEach(message => {
              displayMessage(message.name, message.message, message.name === localStorage.getItem('userName'));
          });
      })
      .catch(error => {
          console.error('Error fetching messages:', error);
      });
  }

  function joinChat() {
      const name = document.getElementById('name-input').value.trim();
      if (name !== '') {
          localStorage.setItem('userName', name);
          showChatRoom();
          const messageData = {
              name: 'Chat Room',
              message: `${name} has joined the chat`
          };
          fetch('/messages', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(messageData)
          })
          .then(response => {
              if (response.ok) {
                  fetchMessages();
              }
          })
          .catch(error => {
              console.error('Error joining chat:', error);
          });
      } else {
          alert("Please enter your name.");
      }
  }

  function leaveChat() {
      const userName = localStorage.getItem('userName');
      if (userName) {
          const leaveMessage = `${userName} has left the chat`;
          displayMessage('Chat Room', leaveMessage, false);
          localStorage.removeItem('userName');
          document.getElementById('chat-room').style.display = 'none';
          document.getElementById('name-input-container').style.display = 'block';
          document.getElementById('name-input').value = '';
      }
  }

  function showChatRoom() {
      document.getElementById('name-input-container').style.display = 'none';
      document.getElementById('chat-room').style.display = 'block';
  }

  sendButton.addEventListener('click', sendMessage);
  document.getElementById('join-button').addEventListener('click', joinChat);
  document.getElementById('leave-button').addEventListener('click', leaveChat);

  fetchMessages();
};
