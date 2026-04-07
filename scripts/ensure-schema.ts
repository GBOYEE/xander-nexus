#!/usr/bin/env node
import { db } from '../lib/db'
import { leads, applications } from '../lib/db/schema'

async function main() {
  try {
    await db.execute('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, password_hash TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())')
    await db.execute('CREATE TABLE IF NOT EXISTS leads (id TEXT PRIMARY KEY, source TEXT NOT NULL, title TEXT NOT NULL, company TEXT NOT NULL, url TEXT NOT NULL, location TEXT, salary TEXT, description TEXT, fetched_at TIMESTAMP NOT NULL, status TEXT DEFAULT \'new\')')
    await db.execute('CREATE TABLE IF NOT EXISTS applications (id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id), platform TEXT NOT NULL, sent_at TIMESTAMP NOT NULL, subject TEXT, body TEXT, status TEXT DEFAULT \'pending\', notes TEXT)')
    console.log('Tables ensured')
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  }
}

main()
