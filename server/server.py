from flask import Flask, request, jsonify, abort
from openai import OpenAI, APIError
from flask_cors import CORS
import os
from dotenv import load_dotenv
import pinecone_upsert
import aven_scraping

load_dotenv()
app = Flask(__name__)
API_KEY = os.getenv('OPENAI_API_KEY')
CORS(app)  
client = OpenAI(api_key=API_KEY)
app.config['CORS_HEADERS'] = 'Content-Type'

def semantic_search(query, top_k=5):
    """Search for relevant content in Pinecone"""
    if not pinecone_upsert.index:
        return []
    
    q_emb = pinecone_upsert.embed([query])[0]
    results = pinecone_upsert.index.query(
        vector=q_emb, 
        top_k=top_k, 
        include_metadata=True
    )
    return results["matches"]

def generate_response(query, search_results):
    """Generate a chat response using OpenAI based on search results"""
    print(f"DEBUG: Query: {query}")
    print(f"DEBUG: Search results count: {len(search_results)}")
    
    if not search_results:
        return "I don't have specific information about that topic. For detailed information about Aven credit cards, requirements, and services, I recommend visiting aven.com or contacting customer support at 1-800-AVEN-HELP."
    
    # Extract relevant text chunks
    context_chunks = []
    for i, result in enumerate(search_results):
        print(f"DEBUG: Result {i}: score={result.get('score', 'N/A')}")
        if result.get("metadata") and result["metadata"].get("chunk"):
            chunk = result["metadata"]["chunk"]
            context_chunks.append(chunk)
            print(f"DEBUG: Added chunk: {chunk[:100]}...")
    
    if not context_chunks:
        return "I found some results but couldn't extract the content. Please try rephrasing your question or contact Aven support for specific details."
    
    # Combine context
    context = "\n\n".join(context_chunks[:3])
    
    # Create a more flexible prompt
    prompt = f"""You are a helpful assistant for Aven, a financial technology company. Based on the following information from Aven's website, please answer the user's question. If the exact information isn't available, provide what relevant information you can and suggest they contact Aven directly for specific details.

Context from Aven website:
{context}

User question: {query}

Please provide a helpful response. If specific details aren't mentioned (like exact credit score requirements), explain what general information is available and suggest contacting Aven for precise details."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful Aven customer service assistant. Be helpful and informative while being honest about what information is and isn't available."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API error: {e}")
        # Fallback with more helpful content
        return f"Based on Aven's information: {context[:300]}... For specific details about your question, please contact Aven support for personalized assistance."

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    input_text = data.get('input')
    
    if not input_text:
        return jsonify({"error": "No input provided"}), 400

    try:
        # Search for relevant content
        search_results = semantic_search(input_text)
        
        # Generate response using OpenAI
        response_message = generate_response(input_text, search_results)
        
        return jsonify({"response": response_message})
    except APIError as e:
        return jsonify({"error": "API error", "message": str(e)}), 500
    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
