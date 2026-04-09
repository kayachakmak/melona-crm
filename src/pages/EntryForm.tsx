import { useState } from 'react'
import { saveEntry } from '../storage'
import { HOTEL_EXTRA_COSTS } from '../types'
import type { HotelStars, RoomType } from '../types'

export const EntryForm = () => {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [flightDepartureTime, setFlightDepartureTime] = useState('')
  const [flightNumber, setFlightNumber] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [installment1, setInstallment1] = useState('')
  const [installment2, setInstallment2] = useState('')
  const [preferredHotel, setPreferredHotel] = useState<HotelStars>('3')
  const [room, setRoom] = useState<RoomType>('single')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await saveEntry({
      id: crypto.randomUUID(),
      name,
      whatsappNumber,
      flightDepartureTime,
      flightNumber,
      totalCost: Number(totalCost),
      downPayment: Number(downPayment),
      installment1: Number(installment1),
      installment2: Number(installment2),
      preferredHotel,
      hotelExtraCost: HOTEL_EXTRA_COSTS[preferredHotel],
      room,
      installment1Paid: false,
      installment2Paid: false,
      createdAt: new Date().toISOString(),
    })

    setName('')
    setWhatsappNumber('')
    setFlightDepartureTime('')
    setFlightNumber('')
    setTotalCost('')
    setDownPayment('')
    setInstallment1('')
    setInstallment2('')
    setPreferredHotel('3')
    setRoom('single')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Patient Entry</h1>
        </div>

        {submitted && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800 font-medium">
            Entry saved successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl bg-white p-8 shadow-lg border border-gray-100"
        >
          {/* Personal Info */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 w-full">
              Personal Information
            </legend>
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className={labelClass}>WhatsApp Number</label>
              <input
                type="tel"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className={inputClass}
                placeholder="+90 555 123 4567"
              />
            </div>
          </fieldset>

          {/* Flight Info */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 w-full">
              Flight Information
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Departure Time</label>
                <input
                  type="datetime-local"
                  required
                  value={flightDepartureTime}
                  onChange={(e) => setFlightDepartureTime(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Flight Number</label>
                <input
                  type="text"
                  required
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className={inputClass}
                  placeholder="TK 1234"
                />
              </div>
            </div>
          </fieldset>

          {/* Payment Info */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 w-full">
              Payment Details
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Total Cost of Treatment</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelClass}>Down Payment</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelClass}>1st Installment</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={installment1}
                  onChange={(e) => setInstallment1(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelClass}>2nd Installment</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={installment2}
                  onChange={(e) => setInstallment2(e.target.value)}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
            </div>
          </fieldset>

          {/* Hotel & Room */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 w-full">
              Accommodation
            </legend>
            <div>
              <label className={labelClass}>Preferred Hotel</label>
              <div className="grid grid-cols-3 gap-3">
                {(['3', '4', '5'] as const).map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setPreferredHotel(star)}
                    className={`rounded-lg border-2 px-4 py-3 text-center transition font-medium ${
                      preferredHotel === star
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{'★'.repeat(Number(star))}</span>
                    <br />
                    <span className="text-xs">
                      {HOTEL_EXTRA_COSTS[star] === 0
                        ? 'Included'
                        : `+$${HOTEL_EXTRA_COSTS[star]}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Room Type</label>
              <div className="grid grid-cols-2 gap-3">
                {(['single', 'double'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRoom(type)}
                    className={`rounded-lg border-2 px-4 py-3 text-center capitalize transition font-medium ${
                      room === type
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition cursor-pointer"
          >
            Submit Entry
          </button>
        </form>
      </div>
    </div>
  )
}
