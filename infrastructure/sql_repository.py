import sqlite3
from core.interfaces import IAuditRepository


class SqliteAuditRepository(IAuditRepository):
    def __init__(self, db_path: str = "neuro_audit_logs.db"):
        self.db_path = db_path
        self._initialize_database()

    def _initialize_database(self):
        query_criacao_tabelas = """
          CREATE TABLE IF NOT EXISTS Users (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT NOT NULL,
            Email VARCHAR(255) NOT NULL,
            Sanity REAL NOT NULL DEFAULT 100.0,
            ReportPath VARCHAR(255) NULL,
            CoffeeCups INTEGER NOT NULL DEFAULT 0,
            HoursWithoutSleep INTEGER NOT NULL DEFAULT 0,
            CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.executescript(query_criacao_tabelas)

    def increment_torture_metrics(self, email: str, coffee: int, sleep_loss: int):
        query = """
            UPDATE Users
            SET CoffeeCups = CoffeeCups + ?, HoursWithoutSleep = HoursWithoutSleep + ?
            WHERE Email = ?
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(query, (coffee, sleep_loss, email))
            conn.commit()

    def save_audit_log(
        self, author_name: str, email: str, sanity_score: float, report_path: str
    ) -> None:
        query_insert = """
            INSERT INTO Users (Name, Email, Sanity, ReportPath)
            VALUES (?, ?, ?, ?)
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(query_insert, (author_name, email, sanity_score, report_path))
            conn.commit()

    def get_history_by_author(self, author_name: str) -> list:
        query_by_author = """
            SELECT Id, Name, Email, Sanity, ReportPath, CreatedAt
            FROM Users
            WHERE Name = ?
            ORDER BY Id DESC
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(query_by_author, (author_name,))
            return cursor.fetchall()

    def update_author(self, user_id: int, sanity: float) -> bool:
        query_update = """
            UPDATE Users
            SET Sanity = ?
            WHERE Id = ?
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(query_update, (sanity, user_id))
            conn.commit()
        return True

    def increment_torture_metrics(self, email: str, coffee: int, sleep_loss: int):
        query = """
            UPDATE Users
            SET CoffeeCups = ?, HoursWithoutSleep = ?
            WHERE Id = (SELECT MAX(Id) FROM Users WHERE Email = ?)
        """
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(query, (coffee, sleep_loss, email))
            conn.commit()
