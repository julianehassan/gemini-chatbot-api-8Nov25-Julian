const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  const typingIndicator = showTyping();


  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        messages: [
          { role: 'user', text: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      console.log('error not ok', response);
      throw new Error('Failed to get response from server.');
    }

    const data = await response.json();

    if (data.result) {
      typingIndicator.remove(); 
      appendMessage('bot', data.result);

    } else {
      botMessage.textContent = 'Sorry, no response received.';
    }

  } catch (error) {
    console.log('error catch', error);
    botMessage.textContent = 'Failed to get response from server.';
    console.error('Error:', error);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  msg.innerHTML = `
    <div class="avatar ${sender === 'user' ? 'user-avatar' : 'bot-avatar'}"></div>
    <div class="bubble">${text}</div>
  `;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  // BOT speaks the message
  if (sender === 'bot') speakText(text);

  return msg;
}
// Simple emoji picker list (you can add more later)
const emojis = ["😀","😄","😂","😊","😍","😎","🤔","😢","😡","👍","🙏","🔥","💀","👏","🎉","💯"];

let emojiPicker;

// Create emoji picker UI
function createEmojiPicker() {
  emojiPicker = document.createElement('div');
  emojiPicker.className = 'emoji-picker';

  emojis.forEach(e => {
    const span = document.createElement('span');
    span.textContent = e;
    span.onclick = () => {
      input.value += e;
      emojiPicker.remove();
    };
    emojiPicker.appendChild(span);
  });

  document.body.appendChild(emojiPicker);

  const rect = input.getBoundingClientRect();
  emojiPicker.style.left = `${rect.left}px`;
  emojiPicker.style.top = `${rect.top - 180}px`;
}

// Toggle emoji picker
document.getElementById('emoji-btn').addEventListener('click', () => {
  if (emojiPicker) {
    emojiPicker.remove();
    emojiPicker = null;
  } else {
    createEmojiPicker();
  }
});

function speakText(text) {
  if (!window.speechSynthesis) return; // Browser support check

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";  // Change to "id-ID" for Indonesian
  utter.rate = 1.0;      // Speaking speed (1.0 normal)
  utter.pitch = 1.0;     // Voice tone (1.0 normal)

  speechSynthesis.speak(utter);
}



