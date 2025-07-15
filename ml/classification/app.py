from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import sys
from .rag_pipeline import build_rag_graph
from langchain_core.messages import HumanMessage

sys.path.append(os.path.dirname(__file__))

from arbre import NoeudArbre  # Import explicite de la classe

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'modele_arbre2.joblib')

app = FastAPI(
    title="API de Prédiction Agrichat",
    description="Prédit la maladie à partir des symptômes saisis via QCM",
    version="1.0"
)

chat_graph = build_rag_graph()

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
    session_id: str

arbre = None  # variable globale pour stocker le modèle

@app.on_event("startup")
def load_model():
    global arbre
    try:
        arbre = joblib.load(MODEL_PATH)
        print(f"Modèle chargé depuis {MODEL_PATH}")
    except FileNotFoundError:
        raise RuntimeError(f"Modèle non trouvé à {MODEL_PATH}. Entraîne-le avec train.py")

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

@app.post("/predict-and-chat")
def predict_sante_with_chat(input_data: SymptomesInput):
    global arbre
    if arbre is None:
        raise HTTPException(status_code=500, detail="Modèle non chargé")
    
    config = {"configurable": {"thread_id": input_data.session_id or "default"}}
    
    exemple = input_data.dict()
    prediction = arbre.predire(exemple)

    output = chat_graph.invoke({"messages": [HumanMessage(content=prediction)]}, config=config)

    print(output)
    
    if prediction is None:
        raise HTTPException(status_code=400, detail="Impossible de prédire avec les données fournies.")
    
    return {
        "prediction": prediction,
        "detail": output
    }

@app.get("/")
def welcome():
    return {
        "message": "Bienvenue sur l'API Agrichat 🌾. Utilisez /predict pour faire une prédiction.",
        "docs": "/docs pour l'interface Swagger",
        "version": app.version
    }
