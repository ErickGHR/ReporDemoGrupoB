import db from '../../db/database'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return db.prepare('SELECT * FROM groups ORDER BY name ASC').all()
  }

  if (event.method === 'POST') {
    const body = await readBody(event)

    const result = db
      .prepare('INSERT INTO groups (name) VALUES (?)')
      .run(body.name)

    return {
      id: result.lastInsertRowid,
      name: body.name
    }
  }
})