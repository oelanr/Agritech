import sys
import os

# Chemins des modules custom
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Pour arbre.py
ARBRE_PATH = os.path.abspath(os.path.join(BASE_DIR, "../ml/classification/src"))
sys.path.append(ARBRE_PATH)

# Pour rag_pipeline.py et schema.py
AGRICHAT_PATH = os.path.abspath(os.path.join(BASE_DIR, "../ml/agrichat/src"))
sys.path.append(AGRICHAT_PATH)

# Imports 
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage

from arbre import NoeudArbre  # Pour la désérialisation joblib
from rag_pipeline import build_rag_graph #pour le RAG
from tools import retrieve  #Pour l'outil retrieve du LLM
from schema import ChatRequest, ChatResponse 

# Initialisation FastAPI unique 
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

#ariables globales
MODEL_PATH = os.path.join(BASE_DIR, '..', 'models', 'model.joblib')
arbre = None
chat_graph = None

#Chargement des modèles au démarrage
@app.on_event("startup")
def startup_event():
    global arbre, chat_graph
    try:
        arbre = joblib.load(MODEL_PATH)
        print(f"Modèle chargé depuis {MODEL_PATH}")
    except FileNotFoundError:
        raise RuntimeError(f"Modèle non trouvé à {MODEL_PATH}. Entraînement nécéssaire (via train.py)")

    chat_graph = build_rag_graph()
    print("Chatbot RAG chargé")

# Modèle Pydantic pour classification 
class SymptomesInput(BaseModel):
    couleur_feuillage: str
    dessechement_feuilles: int
    taches_foliaires: str
    taille_taches: str
    halo_autour_taches: int
    stries: int
    enroulement_feuilles: int
    sterilite: int
    cassure_tige: int
    taches_sur_graines: int
    taille_plant: str
    tallage: str
    humidite: str
    irrigation: str
    semences_infectees: int
    saison: str

#Endpoint classification
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

# Endpoint chatbot 
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

# Endpoint combiné (Requete chatbot après classification)

@app.post("/predict_and_chat")
def predict_and_chat(input_data: SymptomesInput):
    global arbre, chat_graph
    if not all([arbre, chat_graph]):
        raise HTTPException(status_code=500, detail="Modèle(s) non chargé(s).")

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


# Root simple
@app.get("/") 
def root():
    return {"message": "Agrichat API is running 🚀"}


