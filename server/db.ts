import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(import.meta.dirname, '..', 'data.db')
const db = new Database(dbPath)

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    flight_departure_time TEXT NOT NULL,
    flight_number TEXT NOT NULL,
    total_cost REAL NOT NULL,
    down_payment REAL NOT NULL,
    installment1 REAL NOT NULL,
    installment2 REAL NOT NULL,
    preferred_hotel TEXT NOT NULL CHECK(preferred_hotel IN ('3', '4', '5')),
    hotel_extra_cost REAL NOT NULL,
    room TEXT NOT NULL CHECK(room IN ('single', 'double')),
    installment1_paid INTEGER NOT NULL DEFAULT 0,
    installment2_paid INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

// Migrate existing databases that lack the new columns
try {
  db.exec(`ALTER TABLE entries ADD COLUMN installment1_paid INTEGER NOT NULL DEFAULT 0`)
  db.exec(`ALTER TABLE entries ADD COLUMN installment2_paid INTEGER NOT NULL DEFAULT 0`)
} catch {
  // Columns already exist
}

export { db }
