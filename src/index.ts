import { Hotel, Reservation } from "./interfaces";
import { convertReservationData, countRooms, waitForInput, OccupiedRoomsCounter, loadJsonFile } from "./utils";

const main = async () => {

    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("usage: node dist/index.js pathtohotels.json pathtoreservations.json");
        process.exit(1);
    }

    const hotelsFile = args[0]; 
    const reservationsFile = args[1];

    const hotels: Hotel[] = loadJsonFile(hotelsFile);
    const reservations: Reservation[] = convertReservationData(loadJsonFile(reservationsFile));
    const roomsCount: Map<string, {roomType: string, count: number}[]> = countRooms(hotels)
    

    while (true) {
        const input = await waitForInput('input: ');
        if (input == "") process.exit();
        const regex = /Availability\((\w+),\s*(\d{8})(?:-\d{8})?,\s*(\w+)\)/;
        const match = input.match(regex)
        if (!match){
            console.log("invalid format");
            continue;
        }

        const hotelId = match[1];
        const date = match[2];        
        const roomType = match[3];

        const hotel = roomsCount.get(hotelId);

        if (!hotel){
            console.log("no such hotel")
            continue;
        }

        const roomTypeCounter = hotel.find(roomTypeCounter => roomTypeCounter.roomType == roomType)

        if (!roomTypeCounter){
            console.log("no such room type in this hotel")
            continue;
        }

        const occupiedRoomsCounter = new OccupiedRoomsCounter(date);
        const count = occupiedRoomsCounter.count(hotelId, date, roomType, reservations)

        console.log("awailable rooms: ", roomTypeCounter.count - count)
    }
}

main();


