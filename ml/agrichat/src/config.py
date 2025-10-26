from dotenv import load_dotenv, dotenv_values
import io
from langchain.chat_models import init_chat_model
from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings
from pathlib import Path
import os

# Charge le fichier .env local si présent
load_dotenv()

# --- Fonctions utilitaires ---
def load_api_key_from_secret(secret_path, key_name):
    """
    Charge une clé API depuis un secret Docker (ou fichier local).
    """
    if os.path.exists(secret_path):
        with open(secret_path, "r") as f:
            env_content = f.read()
        env_vars = dotenv_values(stream=io.StringIO(env_content))
        if key_name in env_vars:
            return env_vars[key_name]
    return None

# --- LLM Groq ---
groq_api_key = load_api_key_from_secret("/run/secrets/groq_api_key", "GROQ_API_KEY")
if groq_api_key:
    os.environ["GROQ_API_KEY"] = groq_api_key
else:
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY non trouvé dans l'environnement.")

llm = init_chat_model(
    model="llama-3.1-8b-instant", 
    model_provider="groq",
    temperature=0.3,
    top_p=0.9
)
print("LLM chargé.")

# --- Cache HuggingFace ---
cache_dir = Path.home() / ".cache" / "huggingface" / "transformers"
print(f"HuggingFace cache directory: {cache_dir}")

# --- Token HuggingFace ---
hf_api_key = load_api_key_from_secret("/run/secrets/hf_api_key", "HUGGINGFACEHUB_API_TOKEN")
if hf_api_key:
    os.environ["HUGGINGFACEHUB_API_TOKEN"] = hf_api_key
else:
    hf_api_key = os.getenv("HUGGINGFACEHUB_API_TOKEN")
    if not hf_api_key:
        raise ValueError("HUGGINGFACEHUB_API_TOKEN non trouvé dans l'environnement ou fichier secret.")

# --- Embeddings HuggingFace ---
embeddings = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-mpnet-base-v2",
    task="feature-extraction",
    huggingfacehub_api_token=hf_api_key
)
print("HuggingFace embeddings model chargé.")
