# ml/agrichat/src/config.py
from dotenv import load_dotenv, dotenv_values
import io
from langchain.chat_models import init_chat_model
from langchain_huggingface.embeddings import HuggingFaceEndpointEmbeddings
from pathlib import Path
import os

# -------------------------------
# 🔧 Chargement du .env global (racine du projet)
# -------------------------------
ROOT_DIR = Path(__file__).resolve().parents[3]  # <- monte jusqu'à "Agritech/"
ENV_PATH = ROOT_DIR / ".env"

if not ENV_PATH.exists():
    print(f"⚠️ Avertissement : fichier .env introuvable à {ENV_PATH}")
else:
    load_dotenv(ENV_PATH)
    print(f"✅ .env chargé depuis {ENV_PATH}")

# -------------------------------
# 🧩 Fonction utilitaire
# -------------------------------
def load_api_key_from_secret(secret_path, key_name):
    """Charge une clé API depuis un secret Docker ou fichier local."""
    if os.path.exists(secret_path):
        with open(secret_path, "r") as f:
            env_content = f.read()
        env_vars = dotenv_values(stream=io.StringIO(env_content))
        if key_name in env_vars:
            return env_vars[key_name]
    return None

# -------------------------------
# 🔑 Chargement de la clé Groq
# -------------------------------
groq_api_key = (
    load_api_key_from_secret("/run/secrets/groq_api_key", "GROQ_API_KEY")
    or os.getenv("GROQ_API_KEY")
)

if not groq_api_key:
    raise ValueError("❌ ERREUR : GROQ_API_KEY manquante. Vérifie ton .env à la racine du projet.")

os.environ["GROQ_API_KEY"] = groq_api_key

# -------------------------------
# ⚙️ Initialisation du modèle Groq
# -------------------------------
llm = init_chat_model(
    model="llama-3.1-8b-instant",
    model_provider="groq",
    temperature=0.3,
    top_p=0.9,
)
print("✅ Modèle LLM Groq chargé avec succès.")

# -------------------------------
# 🔑 Chargement du token HuggingFace
# -------------------------------
hf_api_key = (
    load_api_key_from_secret("/run/secrets/hf_api_key", "HUGGINGFACEHUB_API_TOKEN")
    or os.getenv("HUGGINGFACEHUB_API_TOKEN")
)

if not hf_api_key:
    raise ValueError("❌ ERREUR : HUGGINGFACEHUB_API_TOKEN manquant dans le .env.")

os.environ["HUGGINGFACEHUB_API_TOKEN"] = hf_api_key

# -------------------------------
# 🧠 Initialisation des embeddings
# -------------------------------
embeddings = HuggingFaceEndpointEmbeddings(
    model="sentence-transformers/all-mpnet-base-v2",
    task="feature-extraction",
    huggingfacehub_api_token=hf_api_key,
)

print("✅ Modèle d'embeddings HuggingFace chargé.")
