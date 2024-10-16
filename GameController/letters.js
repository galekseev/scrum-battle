require('enum').register();
var letters = new Enum({
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5,
    'F': 6,
    'G': 7,
    'H': 8
}, {
    ignoreCase: true
});

var direction = new Enum({
    'U': 1,
    'D': 2,
    'L': 3,
    'R': 4
}, {
    ignoreCase: true
});

module.exports = { letters, direction };