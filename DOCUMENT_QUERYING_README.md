# KMRL IntelliBot - Document-Based Querying System

## Overview
Enhanced ChatAssistantPage with advanced document-based querying capabilities, powered by Groq AI for intelligent document analysis and summarization.

## Features

### 🔖 Document Tagging with @ Symbol
- Type `@` in the chat input to open the document selector
- Browse and select documents from the last 2 days
- Tag multiple documents for comprehensive analysis
- Visual indicators show selected documents

### 🤖 AI-Powered Document Analysis
- Groq AI integration for advanced document summarization
- Intelligent content analysis and key insights extraction
- Cross-document comparison and pattern recognition
- Department-specific recommendations

### 📊 Enhanced Document Management
- Fetch current and previous day documents automatically
- Search documents by title, filename, classification, or department
- Real-time document filtering and selection
- Visual document cards with metadata

### 💬 Smart Chat Interface
- Context-aware responses based on selected documents
- Fallback to regular chat when documents aren't selected
- Professional formatting with structured insights
- Visual indicators for attached documents in chat history

## How to Use

### Basic Document Querying
1. Type `@` in the chat input
2. Document selector appears automatically
3. Search or browse available documents
4. Click to select/deselect documents
5. Ask questions like:
   - "Summarize this document"
   - "What are the key points?"
   - "Analyze these documents for insights"

### Advanced Analysis
```
@[select documents] + "Analyze these documents for compliance issues"
@[select documents] + "Compare these documents and highlight differences"
@[select documents] + "Extract action items from these documents"
```

## API Endpoints

### POST /api/documents/groq-analysis
Document analysis using Groq AI
```json
{
  "message": "Summarize this document",
  "documents": [
    {
      "title": "Document Title",
      "content": "Document content...",
      "classification": "Category",
      "department": "Department Name"
    }
  ],
  "requestType": "document_analysis"
}
```

### GET /api/documents/all
Enhanced with date range filtering
```
/api/documents/all?fromDate=2025-01-01&toDate=2025-01-02&page=1&limit=50
```

## Environment Configuration

Add to `.env` file:
```
GROQ_API_KEY=your-groq-api-key-here
```

## Installation & Setup

1. **Get Groq API Key**
   - Visit [Groq Console](https://console.groq.com/)
   - Create an account and generate API key
   - Add to `.env` file

2. **Install Dependencies**
   ```bash
   cd server
   npm install axios
   ```

3. **Start the Application**
   ```bash
   # Server
   cd server
   npm start
   
   # Client
   cd Client
   npm run dev
   ```

## Technical Implementation

### Frontend Components
- **Document Selector**: Interactive document browsing interface
- **Tag Display**: Visual representation of selected documents
- **Enhanced Input**: @ symbol detection and autocomplete
- **Message Enhancement**: Document attachment visualization

### Backend Integration
- **Groq API**: Advanced AI analysis and summarization
- **Date Filtering**: Enhanced document queries by date range
- **Fallback System**: Graceful degradation when AI service unavailable

### Key Functions
- `fetchDocuments()`: Retrieve recent documents
- `toggleDocumentSelection()`: Manage document selection
- `handleInputChange()`: @ symbol detection and search
- `groqDocumentAnalysis()`: AI-powered document analysis

## Usage Examples

### Document Summarization
```
User: @[selects Annual Report] Summarize this document
AI: **Annual Report Summary**
📋 **Key Highlights:**
• Revenue increased by 15% year-over-year
• Operational efficiency improved by 12%
• New sustainability initiatives launched
...

🎯 **Action Items:**
• Review Q4 performance metrics
• Implement cost optimization strategies
...
```

### Multi-Document Analysis
```
User: @[selects 3 policy documents] Compare these policies and find conflicts
AI: **Policy Comparison Analysis**
⚠️ **Conflicts Identified:**
• Document A allows X, but Document B prohibits X
• Inconsistent approval workflows between policies
...

✅ **Recommendations:**
• Harmonize approval processes
• Update Document B section 3.2
...
```

## Troubleshooting

### Common Issues
1. **Groq API Key Missing**: Add GROQ_API_KEY to .env file
2. **No Documents Loading**: Check date range and database connection
3. **Analysis Failures**: Check Groq API quota and key validity

### Error Handling
- Automatic fallback to basic summaries if Groq API fails
- User-friendly error messages
- Graceful degradation of features

## Future Enhancements
- [ ] Voice input for document queries  
- [ ] PDF preview in chat interface
- [ ] Advanced filters (file type, size, etc.)
- [ ] Document bookmarking system
- [ ] Export analysis results
- [ ] Multi-language document support

## Support
For technical support or feature requests, contact the development team.