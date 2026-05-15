import db from '../../db/database'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const query = getQuery(event)

    return db
      .prepare(`
        SELECT *
        FROM students
        WHERE group_id = ? AND active = 1
        ORDER BY name ASC
      `)
      .all(query.group_id)
  }

  if (event.method === 'POST') {
    const body = await readBody(event)

    const result = db
      .prepare('INSERT INTO students (group_id, name) VALUES (?, ?)')
      .run(body.group_id, body.name)

    return {
      id: result.lastInsertRowid,
      group_id: body.group_id,
      name: body.name
    }
  }

  if (event.method === 'PUT') {
    const body = await readBody(event)

    db.prepare('UPDATE students SET name = ? WHERE id = ?')
      .run(body.name, body.id)

    return { message: 'Estudiante actualizado' }
  }

  if (event.method === 'DELETE') {
    const body = await readBody(event)

    db.prepare('UPDATE students SET active = 0 WHERE id = ?')
      .run(body.id)

    return { message: 'Estudiante eliminado' }
  }
})