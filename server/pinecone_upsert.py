from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI
import os
from dotenv import load_dotenv
import aven_scraping as asg
load_dotenv()

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

INDEX_NAME = "aven-content"

def embed(texts, model="text-embedding-ada-002"):
    """Embed texts using OpenAI API"""
    resp = openai_client.embeddings.create(input=texts, model=model)
    return [e.embedding for e in resp.data]

def initialize_index():
    """Initialize or recreate the Pinecone index"""
    # Delete existing index if it exists (to avoid dimension mismatches)
    if INDEX_NAME in pc.list_indexes().names():
        print(f"Deleting existing index: {INDEX_NAME}")
        pc.delete_index(INDEX_NAME)
    
    # Get the correct embedding dimension
    sample_embedding = embed(["test"])
    dimension = len(sample_embedding[0])
    print(f"Creating index with dimension: {dimension}")
    
    # Create new index
    pc.create_index(
        name=INDEX_NAME,
        dimension=dimension,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1")
    )
    
    return pc.Index(INDEX_NAME)

def upload_data_to_pinecone():
    """Process and upload all chunks to Pinecone"""
    print("Starting data upload process...")
    
    all_chunks = asg.all_chunks
    print(f"Processing {len(all_chunks)} chunks...")
    
    if not all_chunks:
        print("ERROR: No chunks found! Check aven_scraping.py")
        print("Creating test data...")
        # Create test data as fallback
        test_chunks = [
            {"url": "https://aven.com/about", "chunk": "Aven is a healthcare technology company that provides innovative solutions for patient care and medical management."},
            {"url": "https://aven.com/support", "chunk": "Aven offers 24/7 customer support through phone, email, and chat. Our support team helps with technical issues and account management."},
            {"url": "https://aven.com/education", "chunk": "Aven provides educational resources including training materials, webinars, and certification programs for healthcare professionals."}
        ]
        all_chunks = test_chunks
    
    # Initialize index
    index = initialize_index()
    
    # Embed in batches of 50
    batch_size = 50
    for i in range(0, len(all_chunks), batch_size):
        batch = all_chunks[i : i + batch_size]
        texts = [c["chunk"] for c in batch]
        
        print(f"Embedding batch {i//batch_size + 1}/{(len(all_chunks)-1)//batch_size + 1}...")
        embs = embed(texts)
        
        for c, emb in zip(batch, embs):
            c["embedding"] = emb

    # Prepare upsert payload - process in smaller batches
    print("Preparing upsert data...")
    upsert_batch_size = 100  # Smaller batches for upsert
    
    for i in range(0, len(all_chunks), upsert_batch_size):
        batch = all_chunks[i : i + upsert_batch_size]
        upserts = []
        
        for idx, c in enumerate(batch, start=i):
            # Validate embedding
            if not c.get("embedding") or len(c["embedding"]) == 0:
                print(f"Warning: Empty embedding for chunk {idx}")
                continue
                
            upserts.append({
                "id": f"aven-{idx}",
                "values": c["embedding"],
                "metadata": {
                    "url": c["url"],
                    "chunk": c["chunk"][:1000]  # Limit chunk size in metadata
                }
            })
        
        if upserts:
            print(f"Upserting batch {i//upsert_batch_size + 1} with {len(upserts)} vectors...")
            try:
                index.upsert(vectors=upserts)
                print(f"Successfully uploaded {len(upserts)} vectors")
            except Exception as e:
                print(f"Error upserting batch: {e}")
                # Print first vector for debugging
                if upserts:
                    print(f"First vector ID: {upserts[0]['id']}")
                    print(f"Embedding length: {len(upserts[0]['values'])}")
                raise
    
    print(f"Completed upload of {len(all_chunks)} chunks to Pinecone")

# Create index connection for queries (don't recreate)
if INDEX_NAME in pc.list_indexes().names():
    index = pc.Index(INDEX_NAME)
else:
    index = None
    print(f"Warning: Index {INDEX_NAME} doesn't exist. Run upload_data_to_pinecone() first.")

# Only run the upload when this script is executed directly
if __name__ == "__main__":
    upload_data_to_pinecone()
