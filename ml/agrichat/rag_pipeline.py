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
        "Vous êtes un assistant intelligent spécialisé en agriculture, capable de répondre aux questions des utilisateurs sur la santé des plantes, les maladies, les pratiques culturales, et les conditions environnementales. "
        "Lorsque des informations contextuelles sont fournies ci-dessous, utilisez-les en priorité pour formuler votre réponse. "
        "Si le contexte ne permet pas de répondre à la question, vous pouvez vous appuyer sur vos propres connaissances."
        "N'utilisez vos propres connaissances uniquement si la réponse à la question ne se trouve pas dans le contexte."
        "Si la réponse reste incertaine, indiquez-le honnêtement. "
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
