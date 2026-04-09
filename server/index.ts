import express from 'express'
import cors from 'cors'
import { db } from './db.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/entries', (_req, res) => {
  const entries = db.prepare('SELECT * FROM entries ORDER BY flight_departure_time ASC').all()
  res.json(entries)
})

app.post('/api/entries', (req, res) => {
  const {
    id,
    name,
    whatsappNumber,
    flightDepartureTime,
    flightNumber,
    totalCost,
    downPayment,
    installment1,
    installment2,
    preferredHotel,
    hotelExtraCost,
    room,
  } = req.body

  const stmt = db.prepare(`
    INSERT INTO entries (
      id, name, whatsapp_number, flight_departure_time, flight_number,
      total_cost, down_payment, installment1, installment2,
      preferred_hotel, hotel_extra_cost, room
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(
    id, name, whatsappNumber, flightDepartureTime, flightNumber,
    totalCost, downPayment, installment1, installment2,
    preferredHotel, hotelExtraCost, room
  )

  res.status(201).json({ id })
})

app.patch('/api/entries/:id', (req, res) => {
  const { installment1Paid, installment2Paid } = req.body
  const updates: string[] = []
  const values: unknown[] = []

  if (installment1Paid !== undefined) {
    updates.push('installment1_paid = ?')
    values.push(installment1Paid ? 1 : 0)
  }
  if (installment2Paid !== undefined) {
    updates.push('installment2_paid = ?')
    values.push(installment2Paid ? 1 : 0)
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' })
    return
  }

  values.push(req.params.id)
  db.prepare(`UPDATE entries SET ${updates.join(', ')} WHERE id = ?`).run(...values)
  res.json({ ok: true })
})

app.delete('/api/entries/:id', (req, res) => {
  db.prepare('DELETE FROM entries WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
