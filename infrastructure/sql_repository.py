import sqlite3
from core.interfaces import IAuditRepository


class SqliteAuditRepository(IAuditRepository):
    def __int__(self, db_path: str = "neuro_audit_logs.db"):
        self.db_path = db_path
        self._initialize_database()

    def _initialize_database(self):
       
        query_criacao_tabelas = """
          CREATE TABLE IF NOT EXISTS Users (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            Email VARCHAR(255) NOT NULL UNIQUE,
            Sanity REAL NOT NULL DEFAULT 100.0,
            ReportPath varchar(255) NULL,
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        ); 

        """
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript(query_criacao_tabelas)

    def save_audit_log(
        self, author_name: str, sanity_score: int, diagnostic: str
    ) -> None:
        
        query_insert = "INSERT INTO Users (Name,Email,Sanity,ReportPath)values (?,?,?,?)"  # Preencha aqui

        with sqlite3.connect(self.db_path) as conn:
            conn.execute(query_insert, (author_name, sanity_score, diagnostic))
            conn.commit()

    def get_history_by_author(self, author_name: str) -> list:
        # Lógica de SELECT virá aqui
        pass
