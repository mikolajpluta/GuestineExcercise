export interface RoomType {
    code: string;
    description: string;
    amenities: string[];
    features: string[];
  }
  
export interface Room {
    roomType: string;
    roomId: string;
}

export interface Hotel {
    id: string;
    name: string;
    roomTypes: RoomType[];
    rooms: Room[];
}

export interface Reservation {
    hotelId: string;
    arrival: Date;
    departure: Date;
    roomType: string;
    roomRate: string;
}

export interface OccupiedCountStrategy {
    count(hotelId: string, date: string, roomType: string, reservations: Reservation[]): number;
}