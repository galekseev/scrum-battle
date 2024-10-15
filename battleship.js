const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const letters = require("./GameController/letters.js");
let telemetryWorker;

class Battleship {
    start() {
        telemetryWorker = new Worker("./TelemetryClient/telemetryClient.js");   

        console.log("Starting...");
        telemetryWorker.postMessage({eventName: 'ApplicationStarted', properties:  {Technology: 'Node.js'}});

        console.log(cliColor.magenta("                                     |__"));
        console.log(cliColor.magenta("                                     |\\/"));
        console.log(cliColor.magenta("                                     ---"));
        console.log(cliColor.magenta("                                     / | ["));
        console.log(cliColor.magenta("                              !      | |||"));
        console.log(cliColor.magenta("                            _/|     _/|-++'"));
        console.log(cliColor.magenta("                        +  +--|    |--|--|_ |-"));
        console.log(cliColor.magenta("                     { /|__|  |/\\__|  |--- |||__/"));
        console.log(cliColor.magenta("                    +---------------___[}-_===_.'____                 /\\"));
        console.log(cliColor.magenta("                ____`-' ||___-{]_| _[}-  |     |_[___\\==--            \\/   _"));
        console.log(cliColor.magenta(" __..._____--==/___]_|__|_____________________________[___\\==--____,------' .7"));
        console.log(cliColor.magenta("|                        Welcome to Battleship                         BB-61/"));
        console.log(cliColor.magenta(" \\_________________________________________________________________________|"));
        console.log();

        this.InitializeGame();
        this.StartGame();
    }

    StartGame() {
        console.clear();
        console.log(cliColor.yellow("                  __"));
        console.log(cliColor.yellow("                 /  \\"));
        console.log(cliColor.yellow("           .-.  |    |"));
        console.log(cliColor.yellow("   *    _.-'  \\  \\__/"));
        console.log(cliColor.yellow("    \\.-'       \\"));
        console.log(cliColor.yellow("   /          _/"));
        console.log(cliColor.yellow("  |      _  /"));
        console.log(cliColor.yellow("  |     /_\\'"));
        console.log(cliColor.yellow("   \\    \\_/"));
        console.log(cliColor.yellow("    \"\"\"\""));

        let roundNum = 1;
        do {
            console.log(cliColor.green(`========== Round ${roundNum++} ==========`));
            this.printFleetState(this.myFleet, "My fleet", cliColor.magenta);
            this.printFleetState(this.enemyFleet, "Enemy fleet", cliColor.yellow);
            console.log(cliColor.green("Player, it's your turn"));
            console.log(cliColor.green("Your options : Fire!!!"));
            console.log(cliColor.green("Enter coordinates for your shot :"));
            var position = Battleship.ParsePosition(readline.question());
            var isHit = gameController.CheckIsHit(this.enemyFleet, position);

            telemetryWorker.postMessage({eventName: 'Player_ShootPosition', properties:  {Position: position.toString(), IsHit: isHit}});

            if (isHit) {
                beep();
                gameController.Hit(this.enemyFleet, position);

                console.log(cliColor.red("                \\         .  ./"));
                console.log(cliColor.red("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.red("                  (M^^.^~~:.'\")."));
                console.log(cliColor.red("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.red("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.red("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.red("                 -\\  \\     /  /-"));
                console.log(cliColor.red("                   \\  \\   /  /"));
            }

            console.log(isHit ? cliColor.red("Yeah ! Nice hit !") : cliColor.blue("Miss"));

            if (this.getFleetStatus(this.enemyFleet) == "Lost") {
                console.log(cliColor.green("Congratulations! You have won the battle!"));
                break;
            }

            var computerPos = this.GetRandomPosition();
            var isHit = gameController.CheckIsHit(this.myFleet, computerPos);

            telemetryWorker.postMessage({eventName: 'Computer_ShootPosition', properties:  {Position: computerPos.toString(), IsHit: isHit}});

            console.log();
            console.log(`Computer shot in ${computerPos.column}${computerPos.row} and ` + (isHit ? `has hit your ship !` : `miss`));
            if (isHit) {
                gameController.Hit(this.myFleet, computerPos);

                beep();

                console.log(cliColor.red("                \\         .  ./"));
                console.log(cliColor.red("              \\      .:\";'.:..\"   /"));
                console.log(cliColor.red("                  (M^^.^~~:.'\")."));
                console.log(cliColor.red("            -   (/  .    . . \\ \\)  -"));
                console.log(cliColor.red("               ((| :. ~ ^  :. .|))"));
                console.log(cliColor.red("            -   (\\- |  \\ /  |  /)  -"));
                console.log(cliColor.red("                 -\\  \\     /  /-"));
                console.log(cliColor.red("                   \\  \\   /  /"));
            }

            if (this.getFleetStatus(this.myFleet) == "Lost") {
                console.log(cliColor.green("Congratulations! You have won the battle!"));
                break;
            }
        }
        while (true);
    }

    getFleetStatus(fleet) {
        return fleet.filter(ship => ship.getHealth() != "Sunk").length == 0 ? "Lost" : "Alive";
    }

    static ParsePosition(input) {
        var letter = letters.get(input.toUpperCase().substring(0, 1));
        var number = parseInt(input.substring(1, 2), 10);
        return new position(letter, number);
    }

    GetRandomPosition() {
        var rows = 8;
        var lines = 8;
        var rndColumn = Math.floor((Math.random() * lines));
        var letter = letters.get(rndColumn + 1);
        var number = Math.floor((Math.random() * rows));
        var result = new position(letter, number);
        return result;
    }

    InitializeGame() {
        this.myFleet = this.InitializeFixedFleetForTest();
        this.enemyFleet = this.InitializeFixedFleetForTest();

        // this.InitializeMyFleet();
        // this.InitializeEnemyFleet();
    }

    InitializeMyFleet() {
        this.myFleet = gameController.InitializeShips();

        console.log(cliColor.cyan("Please position your fleet (Game board size is from A to H and 1 to 8) :"));

        this.myFleet.forEach(function (ship) {
            console.log();
            console.log(cliColor.cyan(`Please enter the positions for the ${ship.name} (size: ${ship.size})`));
            for (var i = 1; i < ship.size + 1; i++) {
                    console.log(cliColor.cyan(`Enter position ${i} of ${ship.size} (i.e A3):`));
                    const position = readline.question();
                    telemetryWorker.postMessage({eventName: 'Player_PlaceShipPosition', properties:  {Position: position, Ship: ship.name, PositionInShip: i}});
                    ship.addPosition(Battleship.ParsePosition(position));
            }
        })
    }

    InitializeEnemyFleet() {
        this.enemyFleet = this.InitializeFixedFleet();
    }

    InitializeFixedFleetForTest() {
        let fleet = gameController.InitializeShipsForTest();

        fleet[0].addPosition(new position(letters.B, 4));
        fleet[0].addPosition(new position(letters.B, 5));

        return fleet;
    }


    InitializeFixedFleet() {
        let fleet = gameController.InitializeShips();

        fleet[0].addPosition(new position(letters.B, 4));
        fleet[0].addPosition(new position(letters.B, 5));
        fleet[0].addPosition(new position(letters.B, 6));
        fleet[0].addPosition(new position(letters.B, 7));
        fleet[0].addPosition(new position(letters.B, 8));

        fleet[1].addPosition(new position(letters.E, 6));
        fleet[1].addPosition(new position(letters.E, 7));
        fleet[1].addPosition(new position(letters.E, 8));
        fleet[1].addPosition(new position(letters.E, 9));

        fleet[2].addPosition(new position(letters.A, 3));
        fleet[2].addPosition(new position(letters.B, 3));
        fleet[2].addPosition(new position(letters.C, 3));

        fleet[3].addPosition(new position(letters.F, 8));
        fleet[3].addPosition(new position(letters.G, 8));
        fleet[3].addPosition(new position(letters.H, 8));

        fleet[4].addPosition(new position(letters.C, 5));
        fleet[4].addPosition(new position(letters.C, 6));

        return fleet;
    }

    printFleetState(fleet, name, color) {
        console.log(color(`${name} state:`));
        let statusColor;
        for (var i = 0; i < fleet.length; i++) {
            statusColor = fleet[i].getHealth() == "Sunk" ? cliColor.red : fleet[i].getHealth() == "Hit" ? cliColor.yellow : cliColor.green;
            console.log(color(fleet[i].name + " : ") + statusColor(fleet[i].getHealth()));
        }
    }
}

module.exports = Battleship;