class Dog {
    name: string;
    age: number;
    race: string;

    constructor(name: string, age: number, race: string) {
        this.name = name;
        this.age = age;
        this.race = race;
    }

    print() {
        console.log(`Name: ${this.name} \n`, `Age: ${this.age} \n`, `Race: ${this.race}`);
    }
}

const charlie: Dog = new Dog(`Charlie`, 5, `Golden Retriever`);
charlie.print();