import requests

url = 'http://127.0.0.1:8000/api/classifier/predict/'

data = {
    "taches": True,
    "feuille_jaune": False,
    "taches_circulaires": True,
    "bord_feuille_brun": False,
    "fletrissure": False,
    "presence_champignons": True,
    "humidite": "élevée",
    "luminosite": "moyenne",
    "vent": "modéré",
    "pluie_recente": True,
    "stade_croissance": "mature",
    "fertilisation_recente": False,
    "type_sol": "limoneux",
    "irrigation": "automatique"
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
