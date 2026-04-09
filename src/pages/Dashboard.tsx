import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEntries, deleteEntry, updateEntry } from '../storage'
import type { Entry } from '../types'

type PaymentFilter = 'all' | 'unpaid' | 'paid'

export const Dashboard = () => {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all')
  const [hotelFilter, setHotelFilter] = useState<string>('all')

  const fetchEntries = async () => {
    const data = await getEntries()
    setEntries(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteEntry(id)
    fetchEntries()
  }

  const handleTogglePaid = async (
    id: string,
    field: 'installment1Paid' | 'installment2Paid',
    current: boolean
  ) => {
    await updateEntry(id, { [field]: !current })
    fetchEntries()
  }

  const isFullyPaid = (e: Entry) => e.installment1Paid && e.installment2Paid

  const filtered = entries.filter((e) => {
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
    if (paymentFilter === 'paid' && !isFullyPaid(e)) return false
    if (paymentFilter === 'unpaid' && isFullyPaid(e)) return false
    if (hotelFilter !== 'all' && e.preferredHotel !== hotelFilter) return false
    return true
  })

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
          <Link
            to="/"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 transition"
          >
            + New Entry
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 rounded-xl bg-white p-4 shadow-sm border border-gray-100">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-64 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
          />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Fully Paid</option>
          </select>
          <select
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Hotels</option>
            <option value="3">3★</option>
            <option value="4">4★</option>
            <option value="5">5★</option>
          </select>
          <span className="ml-auto self-center text-sm text-gray-500">
            {filtered.length} of {entries.length} patients
          </span>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-lg border border-gray-100">
            <p className="text-gray-500 text-lg">
              {entries.length === 0 ? 'No entries yet.' : 'No entries match your filters.'}
            </p>
            {entries.length === 0 && (
              <Link
                to="/"
                className="mt-4 inline-block text-indigo-600 font-medium hover:text-indigo-500 transition"
              >
                Create your first entry &rarr;
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 font-semibold">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Flight</th>
                  <th className="px-4 py-3">Departure</th>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Down Pmt</th>
                  <th className="px-4 py-3 text-center">1st Inst.</th>
                  <th className="px-4 py-3 text-center">2nd Inst.</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => {
                  const paid = isFullyPaid(entry)
                  const rowBg = paid ? 'bg-green-50' : 'bg-red-50'

                  return (
                    <tr
                      key={entry.id}
                      className={`${rowBg} border-t border-gray-200 hover:brightness-95 transition`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{entry.name}</td>
                      <td className="px-4 py-3 text-gray-700">{entry.whatsappNumber}</td>
                      <td className="px-4 py-3 text-gray-700">{entry.flightNumber}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {formatDate(entry.flightDepartureTime)}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {'★'.repeat(Number(entry.preferredHotel))}
                        {entry.hotelExtraCost > 0 && (
                          <span className="text-xs text-gray-500 ml-1">
                            (+${entry.hotelExtraCost})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700 capitalize">{entry.room}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">
                        ${entry.totalCost.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        ${entry.downPayment.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-gray-700">
                            ${entry.installment1.toLocaleString()}
                          </span>
                          <button
                            onClick={() =>
                              handleTogglePaid(entry.id, 'installment1Paid', entry.installment1Paid)
                            }
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition ${
                              entry.installment1Paid
                                ? 'bg-green-200 text-green-800 hover:bg-green-300'
                                : 'bg-red-200 text-red-800 hover:bg-red-300'
                            }`}
                          >
                            {entry.installment1Paid ? '✓ Paid' : '✗ Unpaid'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-gray-700">
                            ${entry.installment2.toLocaleString()}
                          </span>
                          <button
                            onClick={() =>
                              handleTogglePaid(entry.id, 'installment2Paid', entry.installment2Paid)
                            }
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition ${
                              entry.installment2Paid
                                ? 'bg-green-200 text-green-800 hover:bg-green-300'
                                : 'bg-red-200 text-red-800 hover:bg-red-300'
                            }`}
                          >
                            {entry.installment2Paid ? '✓ Paid' : '✗ Unpaid'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-500 hover:text-red-700 font-medium transition cursor-pointer text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
