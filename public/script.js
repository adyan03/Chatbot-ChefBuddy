const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const headerStatus = document.getElementById('header-status');

let conversationHistory = [];

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

// Parse markdown sederhana ke HTML (**bold**, *italic*, bullet list, paragraf)
function parseMarkdown(text) {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = html.split('\n');
  const result = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    const bulletMatch = line.match(/^[*\-]\s+(.+)/);

    if (bulletMatch) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      let content = formatInlineMarkdown(bulletMatch[1]);
      result.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }

      if (line === '') {
        result.push('<br>');
      } else {
        line = formatInlineMarkdown(line);
        result.push(`<p>${line}</p>`);
      }
    }
  }

  if (inList) {
    result.push('</ul>');
  }

  return result.join('');
}

function formatInlineMarkdown(text) {
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  return text;
}

function createMessageBubble(sender, text) {
  const row = document.createElement('div');
  row.classList.add('message-row', sender);

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble', sender);

  const msgText = document.createElement('div');
  msgText.classList.add('message-text');

  if (sender === 'bot') {
    msgText.innerHTML = parseMarkdown(text);
  } else {
    msgText.textContent = text;
  }

  const msgTime = document.createElement('span');
  msgTime.classList.add('message-time');
  msgTime.textContent = getCurrentTime();

  bubble.appendChild(msgText);
  bubble.appendChild(msgTime);
  row.appendChild(bubble);

  return { row, bubble, msgText };
}

function createTypingIndicator() {
  const row = document.createElement('div');
  row.classList.add('message-row', 'bot');

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble', 'bot');

  const typingDiv = document.createElement('div');
  typingDiv.classList.add('typing-indicator');

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    typingDiv.appendChild(dot);
  }

  bubble.appendChild(typingDiv);
  row.appendChild(bubble);

  return { row, bubble };
}

function scrollToBottom() {
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: 'smooth'
  });
}

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  const userBubble = createMessageBubble('user', userMessage);
  chatBox.appendChild(userBubble.row);
  scrollToBottom();

  conversationHistory.push({ role: 'user', text: userMessage });
  input.value = '';
  input.focus();

  headerStatus.textContent = 'Sedang meracik resep...';
  const typing = createTypingIndicator();
  chatBox.appendChild(typing.row);
  scrollToBottom();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation: conversationHistory })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    chatBox.removeChild(typing.row);

    if (data && data.result) {
      const botBubble = createMessageBubble('bot', data.result);
      chatBox.appendChild(botBubble.row);
      conversationHistory.push({ role: 'model', text: data.result });
    } else {
      const botBubble = createMessageBubble('bot', 'Waduh, resepnya tumpah! 🍳 Bisa tanya lagi?');
      chatBox.appendChild(botBubble.row);
    }
  } catch (error) {
    console.error('Error fetching response:', error);
    chatBox.removeChild(typing.row);
    const botBubble = createMessageBubble('bot', 'Duh, dapurnya lagi mati lampu nih. Coba lagi ya! 🔌');
    chatBox.appendChild(botBubble.row);
  } finally {
    headerStatus.textContent = 'Teman masakmu di dapur!';
    scrollToBottom();
  }
});
