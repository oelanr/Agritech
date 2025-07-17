# vectorstore.py
import os
from langchain_community.document_loaders import DirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from config import embeddings
import time

# Prends le chemin absoly (agrichat/)
script_dir = os.path.dirname(os.path.abspath(__file__))

docs_path = os.path.join(script_dir, '../data')
db_path = os.path.join(script_dir, '../data', 'chroma_langchain_db')

print(f"Chargement des documents de {docs_path}")
print(f"Chargement de la BD de {db_path}")

# Check si le fichier Data existe et contient les données
if os.path.exists(db_path) and os.listdir(db_path):
    # Charge la base de données
    print("Chargement de la base de données vectorielle...")
    #start_time = time.time()
    vector_store = Chroma(
        persist_directory=db_path,
        embedding_function=embeddings,
        collection_name="advice_collection"
    )
    print(f"VectorDB chargée.")
else:
    # Créé et maintient la bd si non existante
    print("VectorDB non trouvée. Création...")
    #start_time = time.time()
    loader = DirectoryLoader(docs_path, glob="**/*.md", show_progress=True)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=100)
    splits = text_splitter.split_documents(docs)

    print("Embedding des documents vers le vector store...")
    vector_store = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        collection_name="advice_collection",
        persist_directory=db_path,
    )
    print(f"VectorDB créée et chargée.")