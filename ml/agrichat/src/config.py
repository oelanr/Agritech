# config.py
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
#Possibilité d'heberger le modèle d'embeddings en local mais temps de réponse significativement plus élevé

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings 
import os
from pathlib import Path
import time

load_dotenv()

llm = init_chat_model("gemma2-9b-it", model_provider="groq")

#mise en cache
cache_dir = Path.home() / ".cache" / "huggingface" / "transformers"
print(f"Cache HuggingFace: {cache_dir}")

start_time = time.time()
embeddings = HuggingFaceEndpointEmbeddings(
            model="sentence-transformers/all-mpnet-base-v2",
            task="feature-extraction",   
)
print(f"Embedding model loaded in {time.time()-start_time}")