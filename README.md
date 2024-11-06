Excercise for Guestline interview

## How to build project
use commands "npm i" then "npm run build"

## How to run
use command "node dist/index.js pathtohotels.json pathtoreservations.json"

# Somme of prompts i have given to ChatGpt
- generate appropriate typescript interfaces for this objects: here examle of hotels.json and reservations <br>
- write a function that loads json from file <br>
- write a function that converts list of json objects (here sample reservation object) to fit this interface (here Reservation interface)
- how to get user's input in js
- how to parse data from brackets from this string Availability(H1,20240901, SGL) 
- write regex that matches both of these formats Availability(H1, 20240901, SGL) and Availability(H1, 20240901-20240903, SGL)