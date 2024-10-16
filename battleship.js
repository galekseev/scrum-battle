const { Worker, isMainThread } = require('worker_threads');
const readline = require('readline-sync');
const gameController = require("./GameController/gameController.js");
const cliColor = require('cli-color');
const beep = require('beepbeep');
const position = require("./GameController/position.js");
const { letters, direction  } = require("./GameController/letters.js");
const fixedFleets = require("./presetFleet.js");
const { dir } = require('console');
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
//                console.log(cliColor.green("Вы победили!"));

                console.log(`
                    (\\
/)                                       (^) 
(^)            you win!                   ,i.
,i.                                     __|_|__ 
__|_|__              ^                   '_______' 
'_______'            (^)              ,---._  |
,%y^\\\`             ,i.             |      \`-^-.__,-.
(/// _\\)            | |             |    ,%y^\\\`    |
(((( -  )))           | |             |   (/// .\\))  |
((|)_*_/(((      _____|_|_____        |  (((( ^ ))))  |
))(/) (\\((|)    ".___________."       | (((|)_v_/((() |
((((\\___/))(\       \\y ,--.y/          |  )))))  ()))) |
/ ,-)     (-. \\      /,---. )\\          |/  ,   |   .  \\|
( ( ( _, ._ ) ) )    / (((\\\\)\\ \\         /  (*   ^   *)  \\
\\ \\ )     ( / /     \\ \\\\-_/ / /        /  /|\`--" \`--"|\\  \\
) y       y (       \\ i   i /        / ." ,--. . ,--. ". \\
\\(         )/        (_)=(_)      __/ /'-/(   \\ /   )\\-'\ \\__
\\_______/           ) . (      /--.,  (  \\   y   /  )  \`.,--\\
\\|/|  /           /\\---/\\             \\  "./  ,"  /
/-^-/           /  )-(  \\             \`--/  /\\--"
(   X           /  /   \\  \\              /  _) \\
\\  \\          / ,"     ". \\            /_/  (_ \\   
\\  y-._     / /         \\ \\                  \\_\\
|\\,' X-'   /-)           (-\\
_,T-)  /    / ^!           !^ \\
(__,-%_/`);


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
                console.log(cliColor.green("Вы проиграли!"));
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
        // this.myFleet = this.InitializeFixedFleetForTest();
        // this.enemyFleet = this.InitializeFixedFleetForTest();

        this.InitializeMyFleet();

        this.enemyFleet = this.InitializeRandomFleet();
    }

    InitializeMyFleet() {
        this.myFleet = gameController.InitializeShips();

        console.log(cliColor.cyan("Please position your fleet (Game board size is from A to H and 1 to 8) :"));

        for (let ship of this.myFleet) {
            console.log();
            console.log(cliColor.cyan(`Please enter the positions for the ${ship.name} (size: ${ship.size})`));

            let pos;
            let isInsideBoundaries;
            let isPositionTaken;
            
            do {
            
                console.log(cliColor.cyan(`Enter position and direction (i.e A3D):`));
                const input = readline.question();
                
                pos = this.parsePosition(input);

                if (!pos.isValid){
                    console.log(cliColor.red("Invalid position. Please try again"));
                    continue;
                }

                isInsideBoundaries = this.checkBoundaries(pos, ship);

                if (!isInsideBoundaries) {
                    console.log(cliColor.red("Invalid position. Please try again"));
                    continue;
                }

                // isPositionTaken = this.checkPositionTaken(pos, ship, this.myFleet);
                // if (isPositionTaken) {
                //     console.log(cliColor.red("Position already taken. Please try again"));
                //     continue;
                // }

                for (var i = 0; i < ship.size; i++) {
                    let newPosition = new position(pos.position.row, pos.position.column.value);
                    switch (pos.direction) {
                        case direction.U:
                            newPosition.column = newPosition.column - i;
                            break;
                        case direction.D:
                            newPosition.column = newPosition.column + i;
                            break;
                        case direction.L:
                            newPosition.row = newPosition.row - i;
                            break;
                        case direction.R:
                            newPosition.row = newPosition.row + i;
                            break;
                    }
                    ship.addPosition(newPosition);
                }

            } while(!pos.isValid || !isInsideBoundaries);
            
            //console.log(ship);
        }
    }

    checkPositionTaken(pos, ship, fleet) {
        let positions = [];
        for (let i = 0; i < fleet.size; i++) {
            for (let j = 0; j < fleet[i].positions.length; j++) {
                positions.push(JSON.stringify(fleet[i].positions[j]));
            }
        }

        for (let i = 0; i < ship.size; i++) {
            let newPosition = new position(pos.position.row, pos.position.column);
            switch (pos.direction) {
                case direction.U:
                    newPosition.column = newPosition.column - i;
                    break;
                case direction.D:
                    newPosition.column = newPosition.column + i;
                    break;
                case direction.L:
                    newPosition.row = newPosition.row - i;
                    break;
                case direction.R:
                    newPosition.row = newPosition.row + i;
                    break;
            }

            if (positions.indexOf(JSON.stringify(newPosition)) != -1) {
                return true;
            }
        }

        return false;
    }
    
    checkBoundaries(pos, ship) {
        switch (pos.direction) {
            case direction.U:
                if (pos.position.column - ship.size < 0) {
                    return false;
                }
                break;
            case direction.D:
                if (pos.position.column + ship.size > 8) {
                    return false;
                }
                break;
            case direction.L:
                if (pos.position.row - ship.size < 0) {
                    return false;
                }
                break;
            case direction.R:
                if (pos.position.row + ship.size > 8) {
                    return false;
                }
                break;
        }
        return true;
    }

    parsePosition(input) {
        var letter = letters.get(input.toUpperCase().substring(0, 1));
        //console.log("Letter: "+letter);
        var number = parseInt(input.substring(1, 2), 10);
        //console.log("Number: "+number);
        var dirLetter = direction.get(input.toUpperCase().substring(2, 3));
        //console.log("Direction: "+dirLetter);

        const isValid = letter != undefined && !isNaN(number) && dirLetter != undefined;

        return { position: new position(letter, number), direction: dirLetter, isValid };
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

    InitializeRandomFleet() {
        let fleet = gameController.InitializeShips();

        let fleetNumber = Math.floor(Math.random() * (fixedFleets.length - 1));
        for (let i = 0; i < fixedFleets[fleetNumber].length; i++) {
            for (let j = 0; j < fixedFleets[fleetNumber][i].length; j++) {
                fleet[i].addPosition(fixedFleets[fleetNumber][i][j]);
            }
        }

        console.log(cliColor.yellow("Game id #" + fleetNumber));

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