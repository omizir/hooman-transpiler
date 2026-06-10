class Flight {
    flightnumber: string;
    duration: number;
    takeoff: string;
    destination: string;

    constructor(fnr: string, dur: number, tkf: string, dst: string) {
        this.flightnumber = fnr;
        this.duration = dur;
        this.takeoff = tkf;
        this.destination = dst;
    }

    print() {
        console.log(`Flight: ${this.flightnumber} \n`, `From: ${this.takeoff} To: ${this.destination} \n`, `Duration: ${this.duration} h`);
    }

    setFlightnumber(fnr: string) {
        this.flightnumber = fnr;
    }

    setDuration(dur: number) {
        this.duration = dur;
    }

    setTakeoff(tkf: string) {
        this.takeoff = tkf;
    }

    setDestination(dst: string) {
        this.destination = dst;
    }
}

class Airport {
    name: string;
    current_flight: Flight;

    constructor(name: string, current_flight: Flight) {
        this.name = name;
        this.current_flight = current_flight;
    }

    print() {
        console.log(`Airport ${this.name} \n`, `Current Flight: \n`, ``);
        this.current_flight.print();
    }
}

const vieToDbx: Flight = new Flight(`F01`, 2, `CGN`, `VIE`);

vieToDbx.setDuration(6);

vieToDbx.setTakeoff(`VIE`);

vieToDbx.setDestination(`DBX`);

const viennaAirport: Airport = new Airport(`Vienna`, vieToDbx);

viennaAirport.print();