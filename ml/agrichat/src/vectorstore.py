import os
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from .config import embeddings
import time

# Get the absolute path of the directory containing the current script (agrichat/tests)
script_dir = os.path.dirname(os.path.abspath(__file__))

# Go up one level to the 'agrichat' directory
agrichat_dir = os.path.dirname(script_dir)

# Construct absolute paths for 'data' and the database directory within 'agrichat/data'
docs_path = os.path.join(agrichat_dir, 'data')
db_path = os.path.join(agrichat_dir, 'data', 'chroma_langchain_db')

# Check if the database directory exists and has files
if os.path.exists(db_path) and os.listdir(db_path):
    # Load the existing database
    print("Loading existing vector store from disk...")
    start_time = time.time()
    vector_store = Chroma(
        persist_directory=db_path,
        embedding_function=embeddings,
        collection_name="advice_collection"
    )
    print(f"Vector store loaded successfully in {time.time()-start_time}.")
else:
    # Create and persist the database if it doesn't exist
    print("No existing vector store found. Creating a new one...")
    start_time = time.time()
    loader = DirectoryLoader(docs_path, glob="**/*.md", show_progress=True)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=100)
    splits = text_splitter.split_documents(docs)

    print("Embedding documents and persisting the vector store...")
    vector_store = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        collection_name="advice_collection",
        persist_directory=db_path,
    )
    
    print(f"Vector store created and persisted successfully.in {time.time()-start_time:.2f}")
