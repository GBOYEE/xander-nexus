import { sql } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, index } from 'drizzle-orm/pg-core'

export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  source: text('source').notNull(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  url: text('url').notNull(),
  location: text('location'),
  salary: text('salary'),
  description: text('description'),
  fetchedAt: timestamp('fetched_at').notNull(),
  status: text('status', { enum: ['new','contacted','responded','interview','offer','archived'] }).default('new')
}, (table) => ({
  statusIdx: index('status_idx')(table.status),
  sourceIdx: index('source_idx')(table.source)
}))

export const applications = pgTable('applications', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull().references(() => leads.id),
  platform: text('platform').notNull(),
  sentAt: timestamp('sent_at').notNull(),
  subject: text('subject'),
  body: text('body'),
  status: text('status', { enum: ['pending','sent','delivered','opened','replied','failed'] }).default('pending'),
  notes: text('notes')
}, (table) => ({
  leadIdx: index('lead_idx')(table.leadId),
  statusIdx: index('app_status_idx')(table.status)
}))

export type Lead = typeof leads.$inferSelect
export type Application = typeof applications.$inferSelect
