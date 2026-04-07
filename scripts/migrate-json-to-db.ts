import { db } from '@/lib/db'
import { leads, applications } from '@/lib/db/schema'

async function migrate() {
  // Migrate leads JSON
  const leadsJson = require('../data/marketer/leads.json')
  for (const l of leadsJson) {
    await db.insert(leads).values(l).onConflictDoUpdate({
      target: leads.id,
      set: l
    }).execute()
  }

  // Migrate applications JSON
  const appsJson = require('../data/marketer/applications.json')
  for (const a of appsJson) {
    await db.insert(applications).values(a).onConflictDoUpdate({
      target: applications.id,
      set: a
    }).execute()
  }

  console.log('Migration complete')
}

migrate().catch(console.error)
