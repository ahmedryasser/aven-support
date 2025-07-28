import os
from dotenv import load_dotenv
from firecrawl import FirecrawlApp
import tiktoken

# Load environment variables
load_dotenv()

def initialize_firecrawl():
    """Initialize FireCrawl app with API key"""
    api_key = os.getenv('FIRECRAWL_API_KEY')
    if not api_key:
        print("Warning: FIRECRAWL_API_KEY not found in environment variables")
        print("Please add FIRECRAWL_API_KEY to your .env file")
        return None
    
    try:
        app = FirecrawlApp(api_key=api_key)
        print("FireCrawl initialized successfully")
        return app
    except Exception as e:
        print(f"Error initializing FireCrawl: {e}")
        return None

def scrape_url_with_firecrawl(app, url):
    """Scrape a single URL using FireCrawl"""
    if not app:
        return ""
    
    print(f"Scraping with FireCrawl: {url}")
    try:
        # Use the simplest FireCrawl API call - just URL and formats
        response = app.scrape_url(url, formats=['markdown'])
        
        # Handle different response formats
        content = ""
        if response:
            # Try different ways to access the markdown content
            if hasattr(response, 'markdown') and response.markdown:
                content = response.markdown
            elif hasattr(response, 'data') and response.data and 'markdown' in response.data:
                content = response.data['markdown']
            elif isinstance(response, dict):
                if 'markdown' in response:
                    content = response['markdown']
                elif 'data' in response and isinstance(response['data'], dict) and 'markdown' in response['data']:
                    content = response['data']['markdown']
            
            if content:
                print(f"Successfully scraped {len(content)} characters from {url}")
                return content
        
        print(f"No markdown content found in response from {url}")
        print(f"Response type: {type(response)}")
        if hasattr(response, '__dict__'):
            print(f"Response attributes: {list(response.__dict__.keys())}")
        elif isinstance(response, dict):
            print(f"Response keys: {list(response.keys())}")
        return ""
            
    except Exception as e:
        print(f"Error scraping {url} with FireCrawl: {e}")
        return ""

def chunk_text(text, max_tokens=500, overlap=50):
    """Split text into chunks for better processing"""
    if not text.strip():
        return []
    
    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(text)
    chunks = []
    start = 0
    
    while start < len(tokens):
        end = min(start + max_tokens, len(tokens))
        chunk = enc.decode(tokens[start:end])
        if chunk.strip():
            chunks.append(chunk.strip())
        start += max_tokens - overlap
    
    return chunks

def get_aven_content():
    """Scrape Aven website content using FireCrawl"""
    urls = [
        "https://www.aven.com/support",
        "https://www.aven.com/about", 
        "https://www.aven.com/education",
        "https://www.trustpilot.com/review/aven.com",
    ]
    
    # Initialize FireCrawl
    app = initialize_firecrawl()
    if not app:
        print("Failed to initialize FireCrawl. Using fallback test data.")
        return {
            "https://www.aven.com/about": "Aven is a healthcare technology company that provides innovative solutions for patient care and medical management.",
            "https://www.aven.com/support": "Aven offers 24/7 customer support through phone, email, and chat. Our support team helps with technical issues and account management.",
            "https://www.aven.com/education": "Aven provides educational resources including training materials, webinars, and certification programs for healthcare professionals."
        }
    
    aven_content = {}
    for url in urls:
        content = scrape_url_with_firecrawl(app, url)
        aven_content[url] = content
    
    return aven_content

def scrape_and_chunk():
    """Create chunks from Aven content using FireCrawl"""
    print("Creating Aven content chunks using FireCrawl...")
    
    content_data = get_aven_content()
    
    all_chunks = []
    for url, content in content_data.items():
        if content:  # Only process if content was successfully retrieved
            chunks = chunk_text(content)
            print(f"Created {len(chunks)} chunks from {url}")
            for chunk in chunks:
                all_chunks.append({"url": url, "chunk": chunk})
        else:
            print(f"No content retrieved from {url}")
    
    print(f"Total chunks created: {len(all_chunks)}")
    
    # If no chunks were created, provide fallback data
    if not all_chunks:
        print("No content scraped successfully. Using fallback test data.")
        fallback_chunks = [
            {"url": "https://www.aven.com/about", "chunk": "Aven is a healthcare technology company that provides innovative solutions for patient care and medical management."},
            {"url": "https://www.aven.com/support", "chunk": "Aven offers 24/7 customer support through phone, email, and chat. Our support team helps with technical issues and account management."},
            {"url": "https://www.aven.com/education", "chunk": "Aven provides educational resources including training materials, webinars, and certification programs for healthcare professionals."}
        ]
        return fallback_chunks
    
    return all_chunks

# Create chunks when module is imported
all_chunks = scrape_and_chunk()
