import type { Entry } from './types'

const API_BASE = '/api/entries'

export const getEntries = async (): Promise<Entry[]> => {
  const res = await fetch(API_BASE)
  const rows = await res.json() as Record<string, unknown>[]
  return rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    whatsappNumber: row.whatsapp_number as string,
    flightDepartureTime: row.flight_departure_time as string,
    flightNumber: row.flight_number as string,
    totalCost: row.total_cost as number,
    downPayment: row.down_payment as number,
    installment1: row.installment1 as number,
    installment2: row.installment2 as number,
    preferredHotel: row.preferred_hotel as Entry['preferredHotel'],
    hotelExtraCost: row.hotel_extra_cost as number,
    room: row.room as Entry['room'],
    installment1Paid: Boolean(row.installment1_paid),
    installment2Paid: Boolean(row.installment2_paid),
    createdAt: row.created_at as string,
  }))
}

export const saveEntry = async (entry: Entry): Promise<void> => {
  await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
}

export const updateEntry = async (
  id: string,
  fields: Partial<Pick<Entry, 'installment1Paid' | 'installment2Paid'>>
): Promise<void> => {
  await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
}

export const deleteEntry = async (id: string): Promise<void> => {
  await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
}
