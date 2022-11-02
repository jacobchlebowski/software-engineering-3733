const level1 = {
    "rows" : 5,
    "columns" : 4,
    "ninjase" :  { "row":2, "column":0 },
    "walls" : [
      { "row":0, "column":3},
      { "row":1, "column":1},
      { "row":1, "column":2},
      { "row":1, "column":3},
      { "row":3, "column":0},
      { "row":3, "column":1},
      { "row":3, "column":3},
      { "row":4, "column":3},
    ],
    "doors" : [
      { "color" : "green", "row":2, "column":3},
      { "color" : "red",   "row":4, "column":1 }
    ],
    "keys": [ 
      { "color" : "green", "row":4, "column":0},
      { "color" : "red",   "row":0, "column":2 }
    ],
  }



const level2 = {
    "rows" : 3,
    "columns" : 4,
    "ninjase" :  { "row":1, "column":0 },
    "walls" : [],
    "doors" : [
      { "color" : "green", "row":2, "column":0},
      { "color" : "green", "row":1, "column":3},
      { "color" : "red",   "row":0, "column":0},
      { "color" : "red",   "row":2, "column":1},
      { "color" : "blue",  "row":0, "column":1},
    ],
    "keys": [
      { "color" : "green", "row":1, "column":2},
      { "color" : "green", "row":2, "column":3},
      { "color" : "red",   "row":1, "column":1},
      { "color" : "red",   "row":2, "column":2},
      { "color" : "blue",  "row":0, "column":3},
    ],
  }



  const level3 = {
    "rows" : 2,
    "columns" : 5,
    "ninjase" :  { "row":0, "column":0 },
    "walls" : [ { "row":1, "column":0 } ],
    "doors" : [
      { "color" : "green",  "row":1, "column":3},
      { "color" : "red",    "row":0, "column":4},
      { "color" : "yellow", "row":1, "column":1},
      { "color" : "blue",   "row":1, "column":2}
    ],
    "keys": [
      { "color" : "red",    "row":0, "column":1},
      { "color" : "green",  "row":0, "column":2},
      { "color" : "blue",   "row":0, "column":3},
      { "color" : "yellow", "row":1, "column":4}
    ],
  }


  export { level1, level2, level3};