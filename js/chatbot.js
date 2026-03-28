/**
 * SmartHire AI Chatbot
 * ============================================================
 * Lightweight AI chatbot assistant for SmartHire platform.
 * Uses keyword matching with the knowledge base.
 */

(function() {
  'use strict';

  // ==================== CHATBOT UI ====================
  
  const chatbotHTML = `
    <div id="smartHireChatbot" class="chatbot-container">
      <!-- Floating Button -->
      <button id="chatbotToggle" class="chatbot-toggle" aria-label="Open chat assistant">
        <span class="chatbot-icon">💬</span>
        <span class="chatbot-close-icon">✕</span>
      </button>

      <!-- Chat Window -->
      <div id="chatbotWindow" class="chatbot-window">
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <span class="chatbot-avatar">🤖</span>
            <div class="chatbot-header-text">
              <span class="chatbot-title">SmartHire Assistant</span>
              <span class="chatbot-status">Online</span>
            </div>
          </div>
          <button id="chatbotMinimize" class="chatbot-minimize" aria-label="Minimize chat">−</button>
        </div>

        <div id="chatbotMessages" class="chatbot-messages">
          <div class="chatbot-message bot-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <p>Hello! 👋 I'm your SmartHire Assistant.</p>
              <p>Ask me anything about posting jobs, screening candidates, interviews, or using the platform.</p>
            </div>
          </div>
        </div>

        <div class="chatbot-input-area">
          <input 
            type="text" 
            id="chatbotInput" 
            class="chatbot-input" 
            placeholder="Ask anything about SmartHire…"
            autocomplete="off"
          />
          <button id="chatbotSend" class="chatbot-send" aria-label="Send message">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>

        <div class="chatbot-suggestions">
          <button class="suggestion-chip">How to post a job?</button>
          <button class="suggestion-chip">Screen candidates</button>
          <button class="suggestion-chip">Schedule interview</button>
        </div>
      </div>
    </div>
  `;

  // ==================== CHATBOT STYLES ====================
  
  const chatbotStyles = `
    .chatbot-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }

    /* Floating Toggle Button */
    .chatbot-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .chatbot-toggle:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(79, 70, 229, 0.5);
    }

    .chatbot-icon,
    .chatbot-close-icon {
      font-size: 24px;
      transition: all 0.3s ease;
      position: absolute;
    }

    .chatbot-close-icon {
      opacity: 0;
      transform: rotate(-90deg);
      color: white;
      font-size: 20px;
    }

    .chatbot-container.open .chatbot-icon {
      opacity: 0;
      transform: rotate(90deg);
    }

    .chatbot-container.open .chatbot-close-icon {
      opacity: 1;
      transform: rotate(0);
    }

    /* Chat Window */
    .chatbot-window {
      position: absolute;
      bottom: 75px;
      right: 0;
      width: 360px;
      height: 500px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s ease;
    }

    .chatbot-container.open .chatbot-window {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    /* Header */
    .chatbot-header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chatbot-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chatbot-avatar {
      font-size: 28px;
      background: rgba(255, 255, 255, 0.2);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chatbot-header-text {
      display: flex;
      flex-direction: column;
    }

    .chatbot-title {
      font-weight: 600;
      font-size: 16px;
    }

    .chatbot-status {
      font-size: 12px;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .chatbot-status::before {
      content: '';
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      display: inline-block;
    }

    .chatbot-minimize {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }

    .chatbot-minimize:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Messages Area */
    .chatbot-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #f9fafb;
    }

    .chatbot-message {
      display: flex;
      gap: 10px;
      max-width: 90%;
      animation: messageSlideIn 0.3s ease;
    }

    @keyframes messageSlideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .bot-message {
      align-self: flex-start;
    }

    .user-message {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .user-message .message-avatar {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .message-content {
      background: white;
      padding: 12px 16px;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      font-size: 14px;
      line-height: 1.5;
      color: #1f2937;
    }

    .bot-message .message-content {
      border-bottom-left-radius: 4px;
    }

    .user-message .message-content {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message-content p {
      margin: 0;
    }

    .message-content p + p {
      margin-top: 8px;
    }

    /* Input Area */
    .chatbot-input-area {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }

    .chatbot-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .chatbot-input:focus {
      border-color: #4f46e5;
    }

    .chatbot-input::placeholder {
      color: #9ca3af;
    }

    .chatbot-send {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .chatbot-send:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
    }

    .chatbot-send:active {
      transform: scale(0.95);
    }

    /* Suggestion Chips */
    .chatbot-suggestions {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      background: white;
      overflow-x: auto;
      border-top: 1px solid #f3f4f6;
    }

    .suggestion-chip {
      padding: 8px 14px;
      background: #f3f4f6;
      border: none;
      border-radius: 20px;
      font-size: 12px;
      color: #4b5563;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }

    .suggestion-chip:hover {
      background: #e5e7eb;
      color: #4f46e5;
    }

    /* Typing Indicator */
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
    }

    .typing-indicator span {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
      animation: typingBounce 1.4s infinite ease-in-out both;
    }

    .typing-indicator span:nth-child(1) {
      animation-delay: -0.32s;
    }

    .typing-indicator span:nth-child(2) {
      animation-delay: -0.16s;
    }

    @keyframes typingBounce {
      0%, 80%, 100% {
        transform: scale(0.6);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Scrollbar Styling */
    .chatbot-messages::-webkit-scrollbar {
      width: 6px;
    }

    .chatbot-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .chatbot-messages::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
    }

    .chatbot-messages::-webkit-scrollbar-thumb:hover {
      background: #9ca3af;
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .chatbot-container {
        bottom: 16px;
        right: 16px;
      }

      .chatbot-window {
        width: calc(100vw - 32px);
        height: calc(100vh - 120px);
        max-height: 500px;
        right: 0;
      }

      .chatbot-toggle {
        width: 54px;
        height: 54px;
      }
    }
  `;

  // ==================== CHATBOT LOGIC ====================

  class SmartHireChatbot {
    constructor() {
      this.isOpen = false;
      this.knowledgeBase = window.chatbotKnowledge || [];
      this.init();
    }

    init() {
      this.injectStyles();
      this.injectHTML();
      this.bindEvents();
    }

    injectStyles() {
      const styleElement = document.createElement('style');
      styleElement.id = 'chatbot-styles';
      styleElement.textContent = chatbotStyles;
      document.head.appendChild(styleElement);
    }

    injectHTML() {
      const container = document.createElement('div');
      container.innerHTML = chatbotHTML;
      document.body.appendChild(container.firstElementChild);

      // Cache DOM elements
      this.container = document.getElementById('smartHireChatbot');
      this.toggleBtn = document.getElementById('chatbotToggle');
      this.minimizeBtn = document.getElementById('chatbotMinimize');
      this.messagesContainer = document.getElementById('chatbotMessages');
      this.input = document.getElementById('chatbotInput');
      this.sendBtn = document.getElementById('chatbotSend');
      this.suggestionChips = document.querySelectorAll('.suggestion-chip');
    }

    bindEvents() {
      // Toggle chat window
      this.toggleBtn.addEventListener('click', () => this.toggle());
      this.minimizeBtn.addEventListener('click', () => this.toggle());

      // Send message
      this.sendBtn.addEventListener('click', () => this.sendMessage());
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });

      // Suggestion chips
      this.suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
          this.input.value = chip.textContent;
          this.sendMessage();
        });
      });
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.container.classList.toggle('open', this.isOpen);
      
      if (this.isOpen) {
        setTimeout(() => this.input.focus(), 300);
      }
    }

    sendMessage() {
      const message = this.input.value.trim();
      if (!message) return;

      // Add user message
      this.addMessage(message, 'user');
      this.input.value = '';

      // Show typing indicator
      this.showTyping();

      // Generate response after delay
      setTimeout(() => {
        this.hideTyping();
        const response = this.generateResponse(message);
        this.addMessage(response, 'bot');
      }, 600 + Math.random() * 400);
    }

    addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chatbot-message ${sender}-message`;

      const avatarEmoji = sender === 'bot' ? '🤖' : '👤';
      
      messageDiv.innerHTML = `
        <div class="message-avatar">${avatarEmoji}</div>
        <div class="message-content">
          <p>${this.escapeHTML(text)}</p>
        </div>
      `;

      this.messagesContainer.appendChild(messageDiv);
      this.scrollToBottom();
    }

    showTyping() {
      const typingDiv = document.createElement('div');
      typingDiv.id = 'typingIndicator';
      typingDiv.className = 'chatbot-message bot-message';
      typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      `;
      this.messagesContainer.appendChild(typingDiv);
      this.scrollToBottom();
    }

    hideTyping() {
      const typingIndicator = document.getElementById('typingIndicator');
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }

    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    generateResponse(query) {
      const normalizedQuery = query.toLowerCase().trim();
      
      // Find best matching knowledge entry
      let bestMatch = null;
      let highestScore = 0;

      for (const entry of this.knowledgeBase) {
        const score = this.calculateMatchScore(normalizedQuery, entry.keywords);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = entry;
        }
      }

      // Return answer if score is above threshold
      if (highestScore >= 0.3 && bestMatch) {
        return bestMatch.answer;
      }

      // Fallback response
      return "I'm not sure about that yet. Please check the help section or contact admin for assistance.";
    }

    calculateMatchScore(query, keywords) {
      let totalScore = 0;
      const queryWords = query.split(/\s+/);

      for (const keyword of keywords) {
        const keywordWords = keyword.toLowerCase().split(/\s+/);
        
        // Exact phrase match
        if (query.includes(keyword.toLowerCase())) {
          totalScore += 1.0;
          continue;
        }

        // Word overlap scoring
        let wordMatches = 0;
        for (const kw of keywordWords) {
          for (const qw of queryWords) {
            if (qw.includes(kw) || kw.includes(qw)) {
              wordMatches++;
            }
          }
        }

        if (keywordWords.length > 0) {
          totalScore += (wordMatches / keywordWords.length) * 0.5;
        }
      }

      // Normalize score
      return keywords.length > 0 ? totalScore / keywords.length : 0;
    }

    escapeHTML(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // ==================== INITIALIZATION ====================

  // Wait for DOM and knowledge base to load
  function initChatbot() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => new SmartHireChatbot());
    } else {
      new SmartHireChatbot();
    }
  }

  // Check if knowledge base is loaded, wait if not
  if (window.chatbotKnowledge) {
    initChatbot();
  } else {
    // Wait for knowledge base script to load
    const checkKnowledge = setInterval(() => {
      if (window.chatbotKnowledge) {
        clearInterval(checkKnowledge);
        initChatbot();
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkKnowledge);
      console.warn('SmartHire Chatbot: Knowledge base not loaded, using empty base');
      initChatbot();
    }, 5000);
  }

})();
