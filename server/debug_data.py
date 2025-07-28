# Create this file to test your setup
import aven_scraping
import pinecone_upsert

print("=== DEBUGGING AVEN SETUP ===")

# Check scraped data
print(f"Number of chunks: {len(aven_scraping.all_chunks)}")
if aven_scraping.all_chunks:
    print(f"First chunk: {aven_scraping.all_chunks[0]}")
    print(f"Sample chunk content: {aven_scraping.all_chunks[0]['chunk'][:200]}...")
else:
    print("NO CHUNKS FOUND!")

# Check Pinecone index
if pinecone_upsert.index:
    stats = pinecone_upsert.index.describe_index_stats()
    print(f"Pinecone index stats: {stats}")
    
    # Test search
    if len(aven_scraping.all_chunks) > 0:
        test_query = "What is Aven?"
        search_results = pinecone_upsert.index.query(
            vector=pinecone_upsert.embed([test_query])[0],
            top_k=3,
            include_metadata=True
        )
        print(f"Test search results: {search_results}")
else:
    print("NO PINECONE INDEX!") 