"""Test-only D1 transport: execute the real SQL on an actual SQLite database."""

import json
import sqlite3
import sys


request = json.load(sys.stdin)
connection = sqlite3.connect(request["path"], timeout=30, isolation_level=None)
connection.row_factory = sqlite3.Row
connection.execute("PRAGMA busy_timeout = 30000")
try:
    if request.get("script"):
        connection.executescript(request["sql"])
        result = None
    else:
        cursor = connection.execute(request["sql"], request.get("bindings", []))
        rows = cursor.fetchall() if cursor.description else []
        result = dict(rows[0]) if rows else None
    print(json.dumps({"result": result}))
finally:
    connection.close()
