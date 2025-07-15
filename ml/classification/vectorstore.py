# vectorstore.py
import os
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from .config import embeddings
import time

# Get the absolute path of the directory containing the current script (agrichat/)
script_dir = os.path.dirname(os.path.abspath(__file__))


docs_path = os.path.join(script_dir, './data')
db_path = os.path.join(script_dir, './data', 'chroma_langchain_db')

print(f"Loading docs from {docs_path}")
print(f"Loading database from {db_path}")

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
    print(f"Vector store loaded successfully in {time.time() - start_time}.")
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
    print(f"Vector store created and persisted successfully in  {time.time() - start_time}.")