from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import anthropic
import base64
import os
import time
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS before mounting static files
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Screenshot(BaseModel):
    image: str

def retry_with_backoff(func, max_retries=3):
    for i in range(max_retries):
        try:
            return func()
        except Exception as e:
            if i == max_retries - 1:  # Last attempt
                raise e
            wait_time = (2 ** i) * 1  # Exponential backoff: 1, 2, 4 seconds
            print(f"Attempt {i + 1} failed, waiting {wait_time} seconds...")
            time.sleep(wait_time)

@app.post("/analyze-screenshot")
async def analyze_screenshot(screenshot: Screenshot):
    print("Endpoint hit with data")
    try:
        if ',' in screenshot.image:
            image_data = screenshot.image.split(',')[1]
        else:
            image_data = screenshot.image
        
        print("Processing image data...")
        
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not found")
        
        client = anthropic.Client(api_key=api_key)
        
        def make_claude_request():
            return client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                messages=[{
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": image_data
                            }
                        },
                        {
                            "type": "text",
                            "text": "Please analyze this screenshot and describe what you see."
                        }
                    ]
                }]
            )

        # Use retry logic
        message = retry_with_backoff(make_claude_request)
        
        return JSONResponse(content={"analysis": message.content[0].text})
    
    except anthropic.APIError as e:
        error_message = f"Claude API Error: {str(e)}"
        print(error_message)
        if "overloaded" in str(e).lower():
            return JSONResponse(
                status_code=503,
                content={"error": "Service temporarily overloaded. Please try again in a few moments."}
            )
        raise HTTPException(status_code=500, detail=error_message)
    except Exception as e:
        print(f"Error processing screenshot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Mount static files after routes are defined
app.mount("/", StaticFiles(directory=".", html=True), name="static")