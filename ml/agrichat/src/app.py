# app.py
from fastapi import FastAPI, HTTPException
from .schema import ChatRequest, ChatResponse
from .rag_pipeline import build_rag_graph
from langchain_core.messages import HumanMessage
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
chat_graph = build_rag_graph()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Agrichat started successfuly"}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        config = {"configurable": {"thread_id": req.session_id or "default"}}
        output = chat_graph.invoke({"messages": [HumanMessage(content=req.question)]}, config=config)
        return ChatResponse(answer=output["messages"][-1].content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
