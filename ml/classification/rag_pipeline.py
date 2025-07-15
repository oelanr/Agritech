# rag_pipeline.py
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import tools_condition, ToolNode
from langchain_core.messages import SystemMessage
from .tools import retrieve
from .config import llm
from langgraph.checkpoint.memory import MemorySaver

def query_or_respond(state: MessagesState):
    llm_with_tools = llm.bind_tools([retrieve])
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

def generate(state: MessagesState):
    recent_tool_messages = [m for m in reversed(state["messages"]) if m.type == "tool"]
    tool_messages = recent_tool_messages[::-1]

    docs_content = "\n\n".join(doc.content for doc in tool_messages)
    system_message_content = (
        "Tu es un assistant de diagnostic pour le jardinage et l'agriculture. Pour toute question d'un utilisateur concernant un problème de plante, tu dois structurer ta réponse en trois parties claires :"
        "1. **Diagnostic :** Confirme le problème en te basant sur les symptômes décrits et les informations du contexte."
        "2. **Actions Immédiates :** Explique ce que l'utilisateur peut faire tout de suite pour gérer la situation (ex: retirer les feuilles malades, appliquer un traitement d'urgence)."
        "3. **Prévention à Long Terme :** Donne des conseils pour éviter que le problème ne réapparaisse à l'avenir (ex: rotation des cultures, aération des plants, arrosage au pied)."
        "Lorsque des informations contextuelles sont fournies ci-dessous, utilise-les en priorité pour formuler votre réponse. "
        "Si le contexte ne permet pas de répondre à la question, tu peux t'appuyer sur tes propres connaissances."
        "N'utilise tes propres connaissances uniquement si la réponse à la question ne se trouve pas dans le contexte."
        "Si la réponse reste incertaine, indique-le honnêtement. "
        "Répondez de manière claire, concise, et adaptée à un public non spécialiste. "
        "Vous pouvez également répondre à des questions générales liées à la conversation ou à la logique du dialogue.\n\n"
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

def build_rag_graph():
    graph_builder = StateGraph(MessagesState)
    graph_builder.add_node("query_or_respond", query_or_respond)
    graph_builder.add_node("tools", ToolNode([retrieve]))
    graph_builder.add_node("generate", generate)

    graph_builder.set_entry_point("query_or_respond")
    graph_builder.add_conditional_edges(
        "query_or_respond", tools_condition, {END: END, "tools": "tools"}
    )
    graph_builder.add_edge("tools", "generate")
    graph_builder.add_edge("generate", END)

    memory = MemorySaver()
    return graph_builder.compile(checkpointer=memory)
