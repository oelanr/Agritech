from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

DATABASE_URL = "sqlite:///./plant_disease.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE chat_messages ADD COLUMN user_id TEXT;"))
        conn.commit()
        print("✅ Colonne 'user_id' ajoutée avec succès.")
    except OperationalError as e:
        if "duplicate column name" in str(e):
            print("ℹ️ Colonne 'user_id' existe déjà, rien à faire.")
        else:
            raise e
