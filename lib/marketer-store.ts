import { db } from '@/lib/db'
import { leads, applications, type Lead, type Application } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export async function getLeads(): Promise<Lead[]> {
  return db.select().from(leads).orderBy(desc(leads.fetchedAt))
}

export async function getLeadById(id: string): Promise<Lead | undefined> {
  const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1)
  return rows[0]
}

export async function saveLead(lead: Lead) {
  const existing = await getLeadById(lead.id)
  if (existing) {
    await db.update(leads).set(lead).where(eq(leads.id, lead.id))
  } else {
    await db.insert(leads).values(lead)
  }
}

export async function getApplications(): Promise<Application[]> {
  return db.select().from(applications).orderBy(desc(applications.sentAt))
}

export async function saveApplication(app: Application) {
  await db.insert(applications).values(app)
}
