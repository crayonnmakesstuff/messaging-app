// script.js

const socket = io();

const messagesList = document.getElementById('messages');
const form = document.getElementById('form');
const input = document.getElementById('input');
const nicknameInput = document.getElementById('nickname');
const changeNicknameBtn = document.getElementById('change-nickname');
const activeUsersContainer = document.getElementById('active-users');

// Listen for new messages
socket.on('chat message', (msg) => {
  const item = document.createElement('li');
  item.textContent = msg;
  messagesList.appendChild(item);
  // Scroll to bottom of the message list
  messagesList.scrollTop = messagesList.scrollHeight;
});

// Listen for active users count
socket.on('active users count', (count) => {
  activeUsersContainer.textContent = `Active Users: ${count}`;
});

// Send message
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

// Change nickname
changeNicknameBtn.addEventListener('click', () => {
  const newNickname = nicknameInput.value.trim();
  if (newNickname) {
    socket.emit('change nickname', newNickname);
  }
});
