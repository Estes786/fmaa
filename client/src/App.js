import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send, Bot, User, Settings, RotateCcw, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import './App.css';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentModel, setCurrentModel] = useState('gpt-4o-mini');
  const [streamingMessage, setStreamingMessage] = useState('');
  const [streamingId, setStreamingId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Available models
  const models = [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Fast)' },
    { id: 'gpt-4o', name: 'GPT-4o (Powerful)' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
  ];

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      withCredentials: true
    });

    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('🔗 Connected to FMAA server');
      setIsConnected(true);
      addSystemMessage('Connected to FMAA Assistant! How can I help you today?');
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      setIsConnected(false);
      addSystemMessage('Disconnected from server. Attempting to reconnect...');
    });

    // Message event handlers
    newSocket.on('message_received', (message) => {
      addMessage(message);
    });

    newSocket.on('message_start', (data) => {
      setStreamingId(data.id);
      setStreamingMessage('');
      setIsTyping(true);
    });

    newSocket.on('message_chunk', (data) => {
      setStreamingMessage(data.fullText);
    });

    newSocket.on('message_complete', (message) => {
      addMessage(message);
      setStreamingMessage('');
      setStreamingId(null);
      setIsTyping(false);
    });

    newSocket.on('agent_typing', (data) => {
      setIsTyping(data.isTyping);
    });

    newSocket.on('message_error', (error) => {
      addSystemMessage(`Error: ${error.error}`, 'error');
      setIsTyping(false);
    });

    newSocket.on('model_switched', (data) => {
      addSystemMessage(`Switched to model: ${data.model}`);
    });

    newSocket.on('conversation_reset', () => {
      setMessages([]);
      addSystemMessage('Conversation reset. Let\'s start fresh!');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const addSystemMessage = (text, type = 'info') => {
    const systemMessage = {
      id: Date.now().toString(),
      text,
      sender: 'system',
      type,
      timestamp: Date.now()
    };
    addMessage(systemMessage);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !isConnected) return;

    const message = inputMessage.trim();
    setInputMessage('');

    // Send message to server
    socket.emit('send_message', {
      message,
      timestamp: Date.now()
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const switchModel = (model) => {
    if (socket && isConnected) {
      socket.emit('switch_model', { model });
      setCurrentModel(model);
    }
  };

  const resetConversation = () => {
    if (socket && isConnected) {
      socket.emit('reset_conversation');
    }
  };

  const formatTime = (timestamp) => {
    return moment(timestamp).format('HH:mm');
  };

  const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
    const isAgent = message.sender === 'agent';

    if (isSystem) {
      return (
        <div className={`system-message ${message.type || 'info'}`}>
          <Activity size={16} />
          <span>{message.text}</span>
        </div>
      );
    }

    return (
      <div className={`message-wrapper ${isUser ? 'user' : 'agent'}`}>
        <div className="message-bubble">
          <div className="message-header">
            {isUser ? <User size={16} /> : <Bot size={16} />}
            <span className="sender-name">
              {isUser ? 'You' : 'FMAA Assistant'}
            </span>
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
          <div className="message-content">
            {isAgent ? (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            ) : (
              <p>{message.text}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StreamingMessage = () => {
    if (!streamingMessage) return null;

    return (
      <div className="message-wrapper agent">
        <div className="message-bubble streaming">
          <div className="message-header">
            <Bot size={16} />
            <span className="sender-name">FMAA Assistant</span>
            <span className="typing-indicator">typing...</span>
          </div>
          <div className="message-content">
            <ReactMarkdown>{streamingMessage}</ReactMarkdown>
            <span className="cursor">|</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>🤖 FMAA Chat</h1>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className="status-dot"></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        <div className="header-controls">
          <select 
            value={currentModel} 
            onChange={(e) => switchModel(e.target.value)}
            className="model-selector"
            disabled={!isConnected}
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          
          <button 
            onClick={resetConversation}
            className="control-btn"
            disabled={!isConnected}
            title="Reset Conversation"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </header>

      <main className="chat-container">
        <div className="messages-area">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          <StreamingMessage />
          
          {isTyping && !streamingMessage && (
            <div className="typing-indicator-wrapper">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>FMAA Assistant is thinking...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              disabled={!isConnected}
              rows={1}
              className="message-input"
            />
            <button 
              onClick={sendMessage}
              disabled={!isConnected || !inputMessage.trim()}
              className="send-btn"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;