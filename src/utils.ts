import { Reservation, Hotel, OccupiedCountStrategy } from "./interfaces";
import * as readline from 'readline';
import * as fs from "fs";
import * as path from "path";

export function loadJsonFile(filePath: string): any {
    try {
        const fullPath = path.resolve(filePath);
        const fileContents = fs.readFileSync(fullPath, "utf-8");
        return JSON.parse(fileContents);
    } catch (error: any) {
        console.error(`Błąd wczytywania pliku ${filePath}: ${error.message}`);
        process.exit(1);
    }
};

function parseStringToDate(date: string): Date {
    return new Date(
        parseInt(date.slice(0, 4)), 
        parseInt(date.slice(4, 6)) - 1, 
        parseInt(date.slice(6, 8))
      )
}

export function convertReservationData(reservationData: { hotelId: string, arrival: string, departure: string, roomType: string, roomRate: string }[]): Reservation[] {
    return reservationData.map(item => ({
      hotelId: item.hotelId,
      arrival: parseStringToDate(item.arrival),
      departure: parseStringToDate(item.departure),
      roomType: item.roomType,
      roomRate: item.roomRate
    }));
}

export function countRooms(hotels: Hotel[]): Map<string, {roomType: string, count: number}[]>{
    let map: Map<string, {roomType: string, count: number}[]> = new Map();

    hotels.forEach(hotel => {
        if (!map.has(hotel.id)) map.set(hotel.id, []);

        const hotelRooms = map.get(hotel.id)!;

        hotel.rooms.forEach(room => {
            const roomTypeObject: {roomType: string, count: number} | undefined = hotelRooms.find(roomType => roomType.roomType == room.roomType);

            if (roomTypeObject) roomTypeObject.count += 1;
            else hotelRooms.push({roomType: room.roomType, count: 1})
        })
    })

    return map;     
}

const rl = readline.createInterface({
    input: process.stdin,  
    output: process.stdout 
});

export const waitForInput = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(question, (answer: string) => {
            resolve(answer);
        });
    });
};

class SingleDateCountStrategy implements OccupiedCountStrategy {
    count(hotelId: string, date: string, roomType: string, reservations: Reservation[]): number {

        let count = 0;
        const localDate = parseStringToDate(date)

        reservations.forEach(reservation => {
            if (reservation.hotelId == hotelId &&
                    reservation.roomType == roomType &&
                    localDate >= reservation.arrival &&
                    localDate <= reservation.departure
                ){
                    count += 1;
                }
        })
        return count;
    }
}

class DateRangeCountStrategy implements OccupiedCountStrategy {
    count(hotelId: string, date: string, roomType: string, reservations: Reservation[]): number {
        let count = 0;

        const dates = date.split("-");
        const startDate = parseStringToDate(dates[0])
        const endDate = parseStringToDate(dates[1])

        reservations.forEach(reservation => {
            if (reservation.hotelId == hotelId &&
                    reservation.roomType == roomType &&
                    !(endDate < reservation.arrival || startDate > reservation.departure)
                ){
                    count += 1;
                }
        })

        return count;

    }
}

export class OccupiedRoomsCounter{
    private strategy: OccupiedCountStrategy;

    constructor(input: string){
        if (input.includes('-')){
            this.strategy = new DateRangeCountStrategy();
        } else {
            this.strategy = new SingleDateCountStrategy();
        }
    }

    count(hotelId: string, date: string, roomType: string, reservations: Reservation[]): number {
        return this.strategy.count(hotelId, date, roomType, reservations)
    }
}