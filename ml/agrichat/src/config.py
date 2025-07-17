from dotenv import load_dotenv, dotenv_values
import io
from langchain.chat_models import init_chat_model
from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings
from pathlib import Path
import os

load_dotenv()

# Loading des api keys (via .env)
def load_api_key_from_secret(secret_path, key_name):
    if os.path.exists(secret_path):
        with open(secret_path, "r") as f:
            # Lecture du fichier .env 
            env_content = f.read()
        # Parse the content using dotenv_values
        env_vars = dotenv_values(stream=io.StringIO(env_content))
        if key_name in env_vars:
            return env_vars[key_name]
    return None

# Initialisation du modèle de langage (LLM) - via GROQCLOUD
groq_api_key = load_api_key_from_secret("/run/secrets/groq_api_key", "GROQ_API_KEY")
if groq_api_key:
    os.environ["GROQ_API_KEY"] = groq_api_key
else:
    # Fallback vers os.getenv 
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY non trouvé danas l'environnement.")

llm = init_chat_model(
    model="gemma2-9b-it",
    model_provider="groq",
    temperature=0.3,
    top_p=0.9
)
print("LLM chargé.")

# Affichage du chemin cache HF (Utilisé pour débug uniquement)
cache_dir = Path.home() / ".cache" / "huggingface" / "transformers"
print(f"HuggingFace cache directory: {cache_dir}")

# Chargement du token Hugging Face depuis le secret
hf_api_key = load_api_key_from_secret("/run/secrets/hf_api_key", "HUGGINGFACE_API_KEY")
if hf_api_key:
    os.environ["HUGGINGFACE_API_KEY"] = hf_api_key
else:
    # Fallback to os.getenv for local development or if secret not found
    hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
    if not hf_api_key:
        raise ValueError("HUGGINGFACE_API_KEY not found in environment or secret file.")

# Initialisation des embeddings
embeddings = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-mpnet-base-v2",
    task="feature-extraction",
    huggingfacehub_api_token=hf_api_key
)
print("HuggingFace embeddings model chargé.")
