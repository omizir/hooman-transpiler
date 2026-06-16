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
    console.log(
      `Flight: ${this.flightnumber} \n`,
      `From: ${this.takeoff} To: ${this.destination} \n`,
      `Duration: ${this.duration} h`,
    );
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
  flights: Flight[];

  constructor(name: string, flights: Flight[]) {
    this.name = name;
    this.flights = flights;
  }

  printFlights() {
    for (const flight of this.flights) {
      flight.print();
    }
  }

  print() {
    console.log(
      `Airport ${this.name} \n`,
      `Flights: \n`,
      `------------------------ \n`,
      ``,
    );
    this.printFlights();
  }
}

const vieToDbx: Flight = new Flight(`F01`, 2, `CGN`, `VIE`);

vieToDbx.setDuration(6);

vieToDbx.setTakeoff(`VIE`);

vieToDbx.setDestination(`DBX`);

const viennaAirport: Airport = new Airport(`Vienna International Airport`, [
  vieToDbx,
]);

viennaAirport.print();
