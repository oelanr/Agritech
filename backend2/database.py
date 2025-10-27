from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker, declarative_base

# --- Configuration de la base ---
DATABASE_URL = "sqlite:///./plant_disease.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Vérifie et ajoute la colonne user_id dans chat_messages ---
inspector = inspect(engine)

if "chat_messages" not in inspector.get_table_names():
    print("⚠️ La table 'chat_messages' n'existe pas encore. La colonne 'user_id' sera ajoutée plus tard.")
else:
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE chat_messages ADD COLUMN user_id TEXT;"))
            print("✅ Colonne 'user_id' ajoutée avec succès.")
        except OperationalError as e:
            if "duplicate column name" in str(e):
                print("ℹ️ Colonne 'user_id' existe déjà, rien à faire.")
            else:
                raise e

# --- Vérifie et ajoute la colonne fullname dans users ---
if "users" not in inspector.get_table_names():
    print("⚠️ La table 'users' n'existe pas encore. La colonne 'fullname' sera ajoutée plus tard.")
else:
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN fullname TEXT;"))
            print("✅ Colonne 'fullname' ajoutée avec succès.")
        except OperationalError as e:
            if "duplicate column name" in str(e):
                print("ℹ️ Colonne 'fullname' existe déjà, rien à faire.")
            else:
                raise e

# --- Session generator ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
