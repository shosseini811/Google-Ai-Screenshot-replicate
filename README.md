# Google AI Screenshot Replicate

## Demo

[View the demo video](https://github.com/user-attachments/assets/251f3cd7-ada3-4a8d-9901-073fa2b4c298)

A web application that replicates Google AI Studio's screenshot capture and analysis functionality using Claude 3 API. This project allows users to capture screenshots of browser tabs, windows, or the entire screen and analyze them using Claude AI.

## Features

- Screenshot capture options:
  - Chrome Tab
  - Window
  - Entire Screen
- Real-time preview of captured screenshots
- AI-powered analysis using Claude 3 Opus
- Responsive UI matching Google AI Studio's design
- Error handling with retry mechanism
- Cross-browser compatibility

## Tech Stack

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
  - Screen Capture API
  - MediaDevices API

- **Backend:**
  - FastAPI (Python)
  - Anthropic Claude 3 API
  - Uvicorn ASGI Server

## Prerequisites

- Python 3.8+
- Anthropic API Key (Claude 3)
- Modern web browser with screen capture support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Google-Ai-Screenshot-replicate.git
cd Google-Ai-Screenshot-replicate
```

2. Create and activate virtual environment:
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
ANTHROPIC_API_KEY=your_claude_api_key_here
```

## Project Structure

```
Google-Ai-Screenshot-replicate/
├── app.py              # FastAPI backend server
├── screenshot.js       # Screenshot capture functionality
├── index.html         # Main web interface
├── requirements.txt   # Python dependencies
├── .env              # Environment variables
└── .gitignore        # Git ignore rules
```

## Usage

1. Start the FastAPI server:
```bash
uvicorn app:app --reload
```

2. Open your browser and navigate to:
```
http://127.0.0.1:8000
```

3. Click "Take Screenshot" button
4. Choose capture type (Tab/Window/Screen)
5. Select the area to capture
6. Click "Share" to analyze the screenshot

## API Endpoints

### POST /analyze-screenshot
Analyzes a screenshot using Claude 3 API

**Request Body:**
```json
{
    "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
    "analysis": "AI-generated analysis of the screenshot"
}
```

## Error Handling

- Implements exponential backoff retry mechanism
- Handles Claude API overload scenarios
- Provides user-friendly error messages
- Validates input data and API responses

## Development

The project uses FastAPI's auto-reload feature for development:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

## Security Considerations

- CORS middleware configured for development
- API key protection
- Input validation
- Error message sanitization


## Known Limitations

- Screen capture requires HTTPS in production
- Some browsers may require permissions
- Claude API rate limits apply
- Large screenshots may need compression

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Google AI Studio's interface
- Uses Anthropic's Claude 3 API
- Built with FastAPI framework

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Future Enhancements

- [ ] Add image compression
- [ ] Implement user authentication
- [ ] Add screenshot history
- [ ] Support for custom AI prompts
- [ ] Batch processing capability


```

This README provides a comprehensive overview of the project, including:
- Detailed setup instructions
- Technical architecture
- Usage guidelines
- API documentation
- Development notes
- Security considerations
- Future roadmap

Make sure to replace `yourusername` with your actual GitHub username and add any specific details about your implementation.