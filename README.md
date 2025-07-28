# Aven Support - AI-Powered Customer Service Platform

A modern customer support platform featuring an AI-powered virtual assistant named Dave, built with React, Flask, and integrated with FireCrawl for web scraping and Pinecone for vector search.

## 🌟 Features

### Patient Interface
- **Voice Interaction**: Speech-to-text and text-to-speech capabilities
- **3D Avatar**: Talking avatar (Dave) with realistic mouth movements
- **Multi-Modal Input**: Both voice and text input support
- **Real-time Conversation**: Live conversation display with history
- **Quick Actions**: Pre-defined help buttons for common queries
- **Responsive Design**: Professional Material-UI interface

### Backend AI System
- **Semantic Search**: Powered by Pinecone vector database
- **Web Scraping**: FireCrawl integration for dynamic content extraction
- **OpenAI Integration**: GPT-powered responses for natural conversations
- **Knowledge Base**: Automated scraping and indexing of Aven website content

## 🏗️ Project Structure

```
aven-support/
├── patient/                    # Patient-facing application
│   ├── client/                # React frontend
│   │   ├── src/
│   │   │   ├── components/    # Modular React components
│   │   │   │   ├── Speech.jsx            # Main chat interface
│   │   │   │   ├── TalkingAvatar.jsx     # 3D avatar component
│   │   │   │   ├── VoiceInput.jsx        # Voice input controls
│   │   │   │   ├── Header.jsx            # App header
│   │   │   │   ├── Sidebar.jsx           # Quick actions sidebar
│   │   │   │   ├── StatusIndicators.jsx  # Status chips
│   │   │   │   ├── CurrentConversation.jsx # Current chat display
│   │   │   │   └── ConversationHistory.jsx # Chat history
│   │   │   ├── App.js         # Main app component
│   │   │   └── index.js       # App entry point
│   │   └── public/
│   │       └── models/        # 3D model files
│   │           └── dave.glb   # Avatar 3D model
│   ├── patient.js             # Patient backend logic
│   └── log.js                 # Logging utilities
├── server/                    # Backend API server
│   ├── server.py              # Flask API server
│   ├── aven_scraping.py       # FireCrawl web scraping
│   ├── pinecone_upsert.py     # Vector database management
│   ├── debug_data.py          # Debugging utilities
│   ├── testing.py             # Test scripts
│   └── requirements.txt       # Python dependencies
└── README.md
```

This README provides a comprehensive overview of your Aven Support project, including:

1. **Clear project description** and features
2. **Detailed setup instructions** with all prerequisites
3. **Project structure** explanation
4. **API documentation** 
5. **Technical architecture** overview
6. **Troubleshooting guide** for common issues
7. **Development guidelines** for extending the system
8. **Professional formatting** with emojis and clear sections

The README is structured to help both developers who need to set up the project and stakeholders who want to understand what the system does and how it works.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16+)
- **Python** (v3.8+)
- **API Keys**:
  - OpenAI API key
  - Pinecone API key
  - FireCrawl API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aven-support
   ```

2. **Setup Backend**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd patient/client
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `server/` directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PINECONE_API_KEY=your_pinecone_api_key_here
   FIRECRAWL_API_KEY=fc-your_firecrawl_api_key_here
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   python server.py
   ```
   The API will be available at `http://localhost:5000`

2. **Start the Frontend**
   ```bash
   cd patient/client
   npm start
   ```
   The web application will open at `http://localhost:3000`

## 🔧 API Endpoints

### Chat Endpoint
- **POST** `/chat`
  - Send user queries and receive AI responses
  - Request: `{ "input": "user message" }`
  - Response: `{ "response": "AI response" }`

## 🤖 How It Works

### Data Pipeline
1. **Web Scraping**: FireCrawl automatically scrapes Aven website content
2. **Text Processing**: Content is chunked and processed for optimal search
3. **Vector Storage**: Text chunks are embedded and stored in Pinecone
4. **Semantic Search**: User queries are matched against relevant content
5. **AI Response**: OpenAI generates contextual responses using retrieved content

### Frontend Features
- **Speech Recognition**: Browser-based speech-to-text
- **3D Avatar**: Three.js powered talking avatar with morph target animations
- **Material-UI**: Professional, accessible interface components
- **Real-time Updates**: Live conversation display with typing indicators

## 📦 Dependencies

### Backend
- `flask` - Web framework
- `flask-cors` - CORS handling
- `openai` - OpenAI API integration
- `firecrawl-py` - Web scraping service
- `pinecone-client` - Vector database
- `tiktoken` - Text tokenization
- `python-dotenv` - Environment variable management

### Frontend
- `react` - UI framework
- `@mui/material` - Material Design components
- `@mui/icons-material` - Material Design icons
- `react-speech-recognition` - Speech-to-text
- `@react-three/fiber` - 3D rendering
- `@react-three/drei` - 3D utilities
- `axios` - HTTP client

## 🎯 Key Components

### Dave Avatar
- **3D Model**: ReadyPlayerMe/Wolf3D compatible GLB model
- **Animations**: Morph target-based mouth movements
- **Realistic Speech**: Synchronized with text-to-speech output

### Voice Interface
- **Continuous Listening**: Auto-stop on silence detection
- **Multi-browser Support**: Chrome, Edge, Safari compatibility
- **Fallback Options**: Text input when voice is unavailable

### AI Knowledge Base
- **Dynamic Content**: Automatically updated from Aven website
- **Semantic Search**: Context-aware information retrieval
- **Fallback Responses**: Graceful handling of unknown queries

## 🔍 Troubleshooting

### Common Issues

1. **Speech Recognition Not Working**
   - Ensure you're using a supported browser (Chrome, Edge, Safari)
   - Check microphone permissions
   - Verify HTTPS connection (required for speech API)

2. **Avatar Not Loading**
   - Confirm `dave.glb` model is in `public/models/`
   - Check browser WebGL support
   - Verify model file integrity

3. **API Connection Errors**
   - Ensure backend server is running on port 5000
   - Check CORS configuration
   - Verify environment variables are set correctly

4. **No AI Responses**
   - Verify OpenAI API key is valid
   - Check Pinecone index is populated
   - Confirm FireCrawl API key is working

## 🛠️ Development

### Adding New Content Sources
1. Update URLs in `aven_scraping.py`
2. Run data upload: `python pinecone_upsert.py`
3. Test with debug script: `python debug_data.py`

### Customizing the Avatar
1. Replace `dave.glb` with your 3D model
2. Update morph target names in `TalkingAvatar.jsx`
3. Adjust scale and positioning as needed

### Extending AI Capabilities
1. Modify prompt templates in `server.py`
2. Add new semantic search parameters
3. Implement custom response filtering

## 📄 License

This project is proprietary software for Aven customer support operations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For technical support or questions:
- Email: support@aven.com
- Phone: 1-800-AVEN-CARD

---

**Built with ❤️ for better customer experiences**

