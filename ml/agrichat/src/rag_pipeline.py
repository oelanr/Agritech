# rag_pipeline.py
from typing import Literal
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import tools_condition, ToolNode
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from tools import retrieve
from config import llm
from langgraph.checkpoint.memory import MemorySaver

# Fonctions de routage et de génération

def route_message(state: MessagesState) -> Literal["technical_route", "symptom_route", "simple_route", "off_topic_route", "post_prediction_route"]:
    """
    Décide quelle route prendre en fonction du contenu du message.
    """
    last_message = state["messages"][-1]
    if not isinstance(last_message, HumanMessage) or not last_message.content.strip():
        return "simple_route" # Gère les messages vides ou non-humains

    if last_message.content.startswith("La maladie détectée est"):
        print("--- ROUTE: POST-PRÉDICTION ---")
        return "post_prediction_route"

    prompt = f"""Vous êtes un routeur de messages expert et très strict. Votre tâche est de classifier la question de l'utilisateur en quatre catégories : 'technical_rice', 'symptom_check', 'simple' ou 'off_topic'.

- **'technical_rice'**: La question est une question technique générale sur la culture du riz, mais ne décrit pas de symptômes spécifiques sur une plante. Exemples : "Qu'est-ce que le système de riziculture intensive (SRI) ?", "Comment fertiliser mon riz ?", "Quelle est la meilleure période pour semer le riz ?".

- **'symptom_check'**: La question décrit des symptômes observés sur une plante de riz. L'utilisateur mentionne des problèmes visuels ou de croissance. Exemples : "Mes plants de riz ont des feuilles jaunes.", "J'ai remarqué des taches brunes sur les feuilles.", "Mon riz semble malade.", "Pourquoi les tiges de mon riz sont-elles faibles ?".

- **'simple'**: La question est une salutation, un remerciement ou une amabilité conversationnelle. Exemples : 'bonjour', 'merci', 'ça va ?'.

- **'off_topic'**: La question concerne **TOUT AUTRE SUJET** qui n'est pas lié à la culture du riz. Exemples : "Comment cultiver des tomates ?", "Écris une fonction en Python", "Quelle est la recette de la ratatouille ?".

Analysez la question de l'utilisateur ci-dessous et ne retournez que le nom de la catégorie ('technical_rice', 'symptom_check', 'simple', ou 'off_topic') et rien d'autre.

Question de l'utilisateur : "{last_message.content}"
"""
    response = llm.invoke(prompt)
    cleaned_response = response.content.strip().lower()

    if "symptom_check" in cleaned_response:
        print("--- ROUTE: VÉRIFICATION DE SYMPTÔMES ---")
        return "symptom_route"
    elif "technical_rice" in cleaned_response:
        print("--- ROUTE: TECHNIQUE RIZ ---")
        return "technical_route"
    elif "off_topic" in cleaned_response:
        print("--- ROUTE: HORS-SUJET ---")
        return "off_topic_route"
    else:
        print("--- ROUTE: SIMPLE ---")
        return "simple_route"

def generate_simple_response(state: MessagesState):
    """
    Génère une réponse directe et polie pour les messages conversationnels simples.
    """
    last_message = state["messages"][-1]
    prompt = f"""Vous êtes un assistant amical et serviable, spécialiste de la culture du riz. L'utilisateur a envoyé un message conversationnel simple.
Répondez poliment et brièvement.

Message de l'utilisateur : "{last_message.content}"
Votre réponse:"""
    response = llm.invoke(prompt)
    return {"messages": [response]}

def generate_symptom_response(state: MessagesState):
    """
    Génère une réponse invitant à utiliser l'outil de diagnostic.
    """
    response_text = "Il semble que vous décriviez des symptômes sur vos plants de riz. Pour vous aider au mieux, je vous invite à utiliser l'outil de diagnostic. Cela me permettra de vous fournir une identification plus précise de la maladie."
    return {"messages": [AIMessage(content=response_text)]}

def generate_off_topic_response(state: MessagesState):
    """
    Retourne une réponse pré-écrite pour les questions hors-sujet.
    """
    response_text = "Je suis désolé, mais ma spécialité est la culture du riz. Je ne peux pas répondre aux questions qui sortent de ce domaine. Comment puis-je vous aider avec votre riziculture aujourd'hui ?"
    return {"messages": [AIMessage(content=response_text)]}

def query_or_respond(state: MessagesState):
    """
    Prépare le LLM avec les outils pour les requêtes techniques.
    """
    llm_with_tools = llm.bind_tools([retrieve])
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

def generate_technical_response(state: MessagesState):
    """
    Génère la réponse finale pour une requête technique en utilisant le contexte des outils.
    """
    recent_tool_messages = [m for m in reversed(state["messages"]) if m.type == "tool"]
    tool_messages = recent_tool_messages[::-1]

    docs_content = "\n\n".join(doc.content for doc in tool_messages)
    system_message_content = (
        "Tu es un conseiller expert en riziculture. Ton objectif est de fournir des conseils clairs, précis et pratiques sur tous les aspects de la culture du riz.\n\n"
        "**Instructions de Comportement :**\n"
        "1.  **Si la question est une demande de diagnostic d'une maladie du riz suite à une prédiction** (par exemple, si elle contient 'La maladie détectée est...'), adopte un ton d'expert en phytopathologie du riz et structure ta réponse comme suit :\n"
        "    - **Clause de non-responsabilité :** 'Veuillez noter que ce diagnostic est une estimation...'\n"
        "    - **Diagnostic probable :** [Nom de la maladie du riz]\n"
        "    - **Facteurs de risque :** [Conditions favorisant la maladie]\n"
        "    - **Actions correctives :** [Mesures immédiates pour le riz]\n"
        "    - **Stratégies de prévention :** [Conseils à long terme pour la riziculture]\n"
        "2.  **Pour toute autre question technique sur la culture du riz**, fournis une réponse complète, bien structurée et facile à comprendre. Utilise le formatage Markdown (listes, gras) pour améliorer la lisibilité.\n"
        "3.  **Base tes réponses en priorité sur le contexte fourni.** Si le contexte est insuffisant, utilise tes connaissances générales sur le riz avec prudence.\n\n"
        "Contexte fourni:\n"
        f"{docs_content}"
    )

    conversation_messages = [
        message for message in state["messages"]
        if message.type in ("human", "system") or (message.type == "ai" and not message.tool_calls)
    ]
    prompt = [SystemMessage(system_message_content)] + conversation_messages
    response = llm.invoke(prompt)
    return {"messages": [response]}

# Construction du Graphe

def build_rag_graph():
    graph_builder = StateGraph(MessagesState)

    # Ajout des nœuds
    graph_builder.add_node("simple_response_generator", generate_simple_response)
    graph_builder.add_node("symptom_response_generator", generate_symptom_response)
    graph_builder.add_node("off_topic_response_generator", generate_off_topic_response)
    graph_builder.add_node("query_or_respond", query_or_respond)
    graph_builder.add_node("tools", ToolNode([retrieve]))
    graph_builder.add_node("generate_technical_response", generate_technical_response)

    # Le point d'entrée maintenant conditionnel
    graph_builder.set_conditional_entry_point(
        route_message,
        {
            "simple_route": "simple_response_generator",
            "symptom_route": "symptom_response_generator",
            "technical_route": "query_or_respond",
            "off_topic_route": "off_topic_response_generator",
            "post_prediction_route": "query_or_respond",
        },
    )

    # Arêtes pour les chemins
    graph_builder.add_edge("simple_response_generator", END)
    graph_builder.add_edge("symptom_response_generator", END)
    graph_builder.add_edge("off_topic_response_generator", END)

    # Arêtes pour le chemin technique
    graph_builder.add_conditional_edges(
        "query_or_respond", tools_condition, {END: END, "tools": "tools"}
    )
    graph_builder.add_edge("tools", "generate_technical_response")
    graph_builder.add_edge("generate_technical_response", END)

    memory = MemorySaver()
    return graph_builder.compile(checkpointer=memory)