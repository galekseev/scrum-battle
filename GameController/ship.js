class Ship {
    constructor(name, size, color) {
        this.name = name;
        this.size = size;
        this.color = color;
        this.positions = [];
        this.health = this.size;
    }

    addPosition(position) {
        this.positions.push(position);
    }

    getHealth() {
        return this.health == 0 ? "Sunk" : this.health < this.size ? "Hit" : "Healthy";
    }

    hit() {
        this.health--;
    }
}

module.exports = Ship;