import { json } from '@remix-run/react'
import { db } from '~/db.server'

export const loader = async () => {
  const users = await db.query.user.findMany()

  return json({ users: users || [] })
}

export const monkey = 'foo'
