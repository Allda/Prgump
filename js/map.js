test1 = {
    xSize : 20,
    zSize : 10,
    player: {x: 1, y: 1, z:5},

    finish: {x: 19, y: 4.4, z: 9},

    starTime: {gold : 10, silver: 20},

    collectibles :
        [
            {x: 1,y: 2, z:3},
            {x: 4,y: 2, z:0},
            {x: 14,y: 6, z:7},
        ],

    mapSrc:
        [
            [
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                [0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,5,0],
                [0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,5,0,5],
                [0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,5,0],
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
                [2,2,2,2,2,2,2,2,5,3,5,2,2,2,2,2,2,2,2,2],
            ],
            [
                [2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,4,4,4,4,4],
                [2,2,2,1,1,1,1,1,0,3,2,2,2,2,2,4,9,9,9,4],
                [2,2,2,1,1,1,1,0,3,3,3,2,2,2,2,4,9,9,9,4],
                [2,2,2,2,2,2,1,0,3,3,2,2,2,2,2,4,4,9,4,4],
                [9,9,9,9,9,2,2,2,5,3,5,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,5,3,5,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,5,3,5,9,9,9,9,9,9,9,9,5],
                [9,9,9,9,9,9,9,9,5,3,5,9,9,9,9,9,9,9,5,5],
                [9,9,9,9,9,9,9,9,5,3,5,9,9,9,9,9,9,5,5,5],
                [1,2,3,4,5,6,2,2,5,3,5,2,2,2,2,2,5,5,5,5],
            ],
            [
                [4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4],
                [4,4,1,9,9,9,9,9,9,9,9,9,9,9,9,4,9,9,9,4],
                [4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,4,9,9,9,4],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,9,4,4],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5,5],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5,5,5],
            ],
            [
                [4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4],
                [4,4,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4],
                [4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,9,4,4],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5,5],
            ],
            [
                [4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4],
                [4,1,9,9,9,9,9,9,9,9,9,9,9,9,9,4,9,9,9,4],
                [4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,4,9,9,9,4],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,4,4],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,6,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,6,6,6,6,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,6,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,5],
            ],
            [
                [4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [4,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,9],
                [4,4,4,9,9,9,9,9,9,9,9,9,9,9,9,9,4,4,4,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,6,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,6,6,6,6,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,6,9,9,9,9],
                [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
            ],
        ]
}

test2 = {
    xSize : 20,
    zSize : 10,
    player: {x: 0, y: 1, z:1},

    finish: {x: 19, y: 0.4, z: 8},

    starTime: {gold : 8, silver: 15},

    collectibles :
        [
            {x: 1,y: 2, z:3},
            {x: 4,y: 2, z:0},
            {x: 14,y: 6, z:7},
        ],

    mapSrc:
        [
            [
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3],
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3],
                [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                [0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3,0,3],
            ],

        ]
}

map4 = {
    xSize : 7,
    zSize : 10,
    player: {x: 0, y: 1, z:0},

    finish: {x: 6, y: 0.4, z: 9},

    starTime: {gold : 15, silver: 26},

    collectibles :
        [
            {x: 0,y: 3, z:9},
            {x: 1,y: 8, z:2},
            {x: 0,y: 6, z:9},
        ],

    mapSrc:
        [
            [
                [0,0,0,0,0,0,0],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,0],
                [0,9,9,9,9,9,9],
                [0,9,9,9,9,9,9],
                [0,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [0,9,9,9,9,9,0],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,0],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [0,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,0,0,0],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
            ],
            [
                [6,6,9,9,9,6,6],
                [9,6,6,9,9,9,6],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,6],
                [9,9,9,9,9,6,6],
            ],
        ]
}

map5 = {
    xSize : 7,
    zSize : 10,
    player: {x: 0, y: 1, z: 0},

    finish: {x: 0, y: 5.4, z: 0},

    starTime: {gold : 30, silver: 50},

    collectibles :
        [
            {x: 6,y: 3, z:2},
            {x: 0,y: 5, z:4},
            {x: 5,y: 11, z:8},
        ],

    mapSrc:
        [
            [
                [2,9,9,9,1,1,1],
                [3,9,9,9,1,2,1],
                [3,9,9,9,1,1,1],
                [2,9,9,9,9,9,2],
                [1,9,9,9,9,5,1],
                [2,9,9,9,9,9,2],
                [3,9,9,9,9,9,3],
                [3,9,9,9,9,9,3],
                [5,9,9,9,9,5,5],
                [1,5,3,3,3,5,1],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
            ],
            [
                [6,6,9,9,9,9,9],
                [6,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,4,9],
                [9,9,9,9,9,9,9],
            ],
        ]
}

map2 = {
    xSize : 7,
    zSize : 10,
    player: {x: 0, y: 1, z: 0},

    finish: {x: 6, y: 3.4, z: 9},

    starTime: {gold : 12, silver: 18},

    collectibles :
        [
            {x: 4,y: 2, z:6},
            {x: 4,y: 6, z:4},
        ],

    mapSrc:
        [
            [
                [0,9,0,9,0,9,0],
                [9,9,9,9,9,9,9],
                [0,9,0,9,0,9,0],
                [9,9,9,9,9,9,9],
                [0,9,0,9,0,9,0],
                [9,9,9,9,9,9,9],
                [0,9,0,9,9,9,9],
                [9,9,9,9,9,9,9],
                [0,9,0,9,9,9,9],
                [9,0,9,9,9,9,0],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,0,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,0],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,0],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,0,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,0],
            ],
            [
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,0,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
                [9,9,9,9,9,9,9],
            ],
        ]

}

map1 = {
    xSize : 10,
    zSize : 1,
    player: {x: 0, y: 1, z: 0},

    finish: {x: 9, y: 5.4, z: 0},

    starTime: {gold : 4, silver: 7},

    collectibles :
        [
            {x: 5,y: 5, z:0},
        ],

    mapSrc:
        [
            [
                [0,0,0,0,1,0,3,0,3,0],
            ],
            [
                [9,0,9,0,9,0,9,0,9,0],
            ],
            [
                [9,9,9,0,9,0,9,0,9,0],
            ],
            [
                [9,9,9,9,9,0,9,0,9,0],
            ],
            [
                [9,9,9,9,9,9,9,9,9,0],
            ],
            [
                [9,9,9,9,9,9,9,9,9,0],
            ],
        ]

}

map3 = {
    xSize : 3,
    zSize : 10,
    player: {x: 0, y: 1, z: 0},

    finish: {x: 0, y: 5.4, z: 0},

    starTime: {gold : 12, silver: 26},

    collectibles :
        [
            {x: 0,y: 4, z:9},
        ],

    mapSrc:
        [
            [
                [0,0,0],
                [0,0,0],
                [0,0,0],
                [1,1,1],
                [3,3,3],
                [3,3,3],
                [3,3,3],
                [0,0,0],
                [3,3,3],
                [1,1,1],
            ],
            [
                [9,9,9],
                [0,9,9],
                [9,9,9],
                [9,9,0],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
            ],
            [
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [0,9,9],
                [9,9,9],
                [9,0,9],
                [9,9,9],
                [9,9,0],
            ],
            [
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,0],
            ],
            [
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
                [9,9,9],
            ],
            [
                [0,9,9],
                [9,9,0],
                [9,9,9],
                [9,9,0],
                [9,9,9],
                [0,9,9],
                [9,9,9],
                [9,0,9],
                [9,9,9],
                [9,9,9],
            ],
        ]

}


mapSrc = [
    map1,
    map2,
    map3,
    map4,
    map5,
    test1,
    test2,
]
