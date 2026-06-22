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
      `Duration: ${this.duration}`,
    );
    if (this.duration > 4) {
      console.log(`Long-haul flight. \n`, ``);
    } else {
      console.log(`Short-haul flight. \n`, ``);
    }
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

const cgnToVie: Flight = new Flight(`F01`, 2, `CGN`, `VIE`);

const vieToDbx: Flight = new Flight(`F02`, 6, `VIE`, `DBX`);

const viennaAirport: Airport = new Airport(`Vienna International Airport`, [
  vieToDbx,
  cgnToVie,
]);

viennaAirport.print();
