
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './dev.db',
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function createSchema() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT,
      emailNotifications BOOLEAN DEFAULT false,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME
    );

    CREATE TABLE IF NOT EXISTS Session (
      id TEXT PRIMARY KEY,
      userId TEXT,
      surah INTEGER,
      startAyah INTEGER,
      endAyah INTEGER,
      startPage INTEGER,
      endPage INTEGER,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      duration INTEGER,
      FOREIGN KEY (userId) REFERENCES User(id)
    );

    CREATE TABLE IF NOT EXISTS Goal (
      id TEXT PRIMARY KEY,
      userId TEXT,
      type TEXT,
      targetAmount INTEGER,
      deadline DATETIME,
      status TEXT DEFAULT 'ACTIVE',
      lastNotificationSent DATETIME,
      notificationCount INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES User(id)
    );
  `);
}
