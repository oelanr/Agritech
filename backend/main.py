import sys
import os

# === Ajouter les chemins des modules custom ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Pour arbre.py
ARBRE_PATH = os.path.abspath(os.path.join(BASE_DIR, "../ml/classification/src"))
sys.path.append(ARBRE_PATH)

# Pour rag_pipeline.py et schema.py
AGRICHAT_PATH = os.path.abspath(os.path.join(BASE_DIR, "../ml/agrichat/src"))
sys.path.append(AGRICHAT_PATH)

# === Imports ===
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage

from arbre import NoeudArbre  # Pour la désérialisation joblib
from rag_pipeline import build_rag_graph
from tools import retrieve  # ajoute ça tout en haut
from schema import ChatRequest, ChatResponse

# === Initialisation FastAPI unique ===
app = FastAPI(
    title="API Agrichat",
    description="API classification maladies + chatbot",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en dev, sinon mettre l'URL frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Variables globales ===
MODEL_PATH = os.path.join(BASE_DIR, '..', 'models', 'modele_arbre2.joblib')
arbre = None
chat_graph = None

# === Chargement des modèles au démarrage ===
@app.on_event("startup")
def startup_event():
    global arbre, chat_graph
    try:
        arbre = joblib.load(MODEL_PATH)
        print(f"Modèle chargé depuis {MODEL_PATH}")
    except FileNotFoundError:
        raise RuntimeError(f"Modèle non trouvé à {MODEL_PATH}. Entraîne-le avec train.py")

    chat_graph = build_rag_graph()
    print("Chatbot RAG chargé")

# === Modèle Pydantic pour classification ===
class SymptomesInput(BaseModel):
    taches: bool
    feuille_jaune: bool
    taches_circulaires: bool
    bord_feuille_brun: bool
    fletrissure: bool
    presence_champignons: bool
    humidite: str
    luminosite: str
    vent: str
    pluie_recente: bool
    stade_croissance: str
    fertilisation_recente: bool
    type_sol: str
    irrigation: str

# === Endpoint classification ===
@app.post("/predict")
def predict_sante(input_data: SymptomesInput):
    global arbre
    if arbre is None:
        raise HTTPException(status_code=500, detail="Modèle non chargé")

    exemple = input_data.dict()
    prediction = arbre.predire(exemple)

    if prediction is None:
        raise HTTPException(status_code=400, detail="Impossible de prédire avec les données fournies.")

    return {
        "prediction": prediction,
        "detail": f"Classe prédite par l'arbre de décision : {prediction}"
    }

# === Endpoint chatbot ===
@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    global chat_graph
    if chat_graph is None:
        raise HTTPException(status_code=500, detail="Chatbot non chargé")

    try:
        config = {"configurable": {"thread_id": req.session_id or "default"}}
        output = chat_graph.invoke({"messages": [HumanMessage(content=req.question)]}, config=config)
        return ChatResponse(answer=output["messages"][-1].content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# === Endpoint combiné ===

@app.post("/predict_and_chat")
def predict_and_chat(input_data: SymptomesInput):
    global arbre, chat_graph
    if not all([arbre, chat_graph]):
        raise HTTPException(status_code=500, detail="Un ou plusieurs modèles ne sont pas chargés.")

    exemple = input_data.dict()
    prediction = arbre.predire(exemple)

    if prediction is None:
        raise HTTPException(status_code=400, detail="Impossible de prédire avec les données fournies.")

    # Prompt pour le chatbot
    prompt = f"La maladie détectée est {prediction}. Quels conseils pouvez-vous donner ?"

    try:
        output = chat_graph.invoke(
            {"messages": [HumanMessage(content=prompt)]},
            config={"configurable": {"thread_id": "predict_and_chat"}}
        )
        raw_answer = output["messages"][-1].content

        # Vérifie si le chatbot demande à appeler un outil
        if "<tool_use>" in raw_answer and "retrieve" in raw_answer:
            # On extrait manuellement le paramètre (naïvement ici)
            import re, json

            match = re.search(r'"query"\s*:\s*"([^"]+)"', raw_answer)
            if match:
                query = match.group(1)
                final_answer = retrieve(query)  # appelle le vrai outil
            else:
                final_answer = "Erreur : paramètre 'query' introuvable dans le tool_use."
        else:
            final_answer = raw_answer

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur chatbot : {str(e)}")

    return {
        "prediction": prediction,
        "chatbot_answer": final_answer
    }


# === Root simple ===
@app.get("/")
def root():
    return {"message": "Agrichat API is running 🚀"}
