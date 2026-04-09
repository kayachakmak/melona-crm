export type HotelStars = '3' | '4' | '5'
export type RoomType = 'single' | 'double'

export type Entry = {
  id: string
  name: string
  whatsappNumber: string
  flightDepartureTime: string
  flightNumber: string
  totalCost: number
  downPayment: number
  installment1: number
  installment2: number
  preferredHotel: HotelStars
  hotelExtraCost: number
  room: RoomType
  installment1Paid: boolean
  installment2Paid: boolean
  createdAt: string
}

export const HOTEL_EXTRA_COSTS: Record<HotelStars, number> = {
  '3': 0,
  '4': 150,
  '5': 350,
}
