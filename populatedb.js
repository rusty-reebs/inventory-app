#! /usr/bin/env node

console.log(
  "This script populates some test items, manufacturers, categories and origins to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Manufacturer = require("./models/manufacturer");
var MadeIn = require("./models/made_in");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var manufacturers = [];
var made_ins = [];
var categories = [];

function itemCreate(
  name,
  description,
  manufacturer,
  made_in,
  category,
  price,
  number_in_stock,
  cb
) {
  var item = new Item({
    name: name,
    description: description,
    manufacturer: manufacturer,
    made_in: made_in,
    category: category,
    price: price,
    number_in_stock: number_in_stock,
  });

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function manufacturerCreate(name, description, established, cb) {
  var manufacturer = new Manufacturer({
    name: name,
    description: description,
    established: established,
  });

  manufacturer.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Manufacturer: " + manufacturer);
    manufacturers.push(manufacturer);
    cb(null, manufacturer);
  });
}

function made_inCreate(name, cb) {
  var made_in = new MadeIn({ name: name });
  made_in.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New MadeIn: " + made_in);
    made_ins.push(made_in);
    cb(null, made_in);
  });
}

function categoryCreate(name, cb) {
  var category = new Category({ name: name });
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function createItems(cb) {
  async.series(
    [
      function (callback) {
        itemCreate(
          "Trance",
          "This is a trail bike that thrives in the most challenging conditions. The frameset is engineered with a lightweight yet super strong and stiff ALUXX SL aluminum frame. It has updated Maestro rear suspension featuring a trunnion-mount shock and Advanced Forged Composite rocker arm to soak up bumps small and large. Just pick your line, point it and go.",
          manufacturers[0],
          made_ins[0],
          [categories[0]],
          2450,
          8,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Anthem 29",
          "With an ALUXX SL aluminum frameset that’s engineered with 90mm of rear suspension travel and 100mm up front, this smooth-riding 29er is a master at conquering technical XC terrain.",
          manufacturers[0],
          made_ins[0],
          [categories[0]],
          2485,
          11,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Fuel EX 9.9",
          "Fuel EX 9.9 makes no compromises. Top-shelf suspension, carbon everything, and SRAM's latest X01 Eagle AXS wireless drivetrain make this ripper ready to rule any trail in style. It's fast, it's light, and it's got everything you need to crush your next trail ride.",
          manufacturers[1],
          made_ins[3],
          [categories[0]],
          10549,
          2,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "SuperSix EVO",
          "Fast, just got faster. A pure road bike. Light, smooth and ultra fast. The evolution of the classic race machine.",
          manufacturers[2],
          made_ins[0],
          [categories[1]],
          6000,
          5,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Fixture MIPS",
          "The dirt is calling. Giro Fixture MIPS bike helmet brings confident mountain bike style and breezy ventilation together in a compact design made for nearly any ride, from fire roads to singletrack.",
          manufacturers[3],
          made_ins[1],
          [categories[2]],
          70,
          12,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Covert Bike Gloves",
          "Straightforward design gives the DAKINE Covert bike gloves a light feel, while the durable build offers years of bar-gripping control and palm protection if you end up sliding instead of riding.",
          manufacturers[4],
          made_ins[2],
          [categories[2], categories[3]],
          27,
          18,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Classic Light Hydration Pack",
          "This pack is exactly what your everyday ride was missing. Lightweight, adjustable and ready to hit the road for adventures of any length, the CamelBak Classic Light hydration pack is an easy pick.",
          manufacturers[5],
          made_ins[1],
          categories[3],
          70,
          10,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Podium Dirt Series Chill Insulated Water Bottle",
          "For mountain bikers who prioritize performance and functionality above all else, the 21 oz. CamelBak Podium Dirt Series Chill insulated water bottle keeps you hydrated when you're going hard.",
          manufacturers[5],
          made_ins[2],
          categories[3],
          17,
          22,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Dissector 3CT EXO TR",
          "Designed in conjunction with Aussie downhill racer Troy Brosnan, the go-fast Maxxis Dissector 3CT EXO TR tire minimizes drag while retaining cornering control.",
          manufacturers[6],
          made_ins[0],
          categories[4],
          80,
          13,
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Trail King Performance",
          "The 29 in. Continental Trail King Performance mountain bike tire shines on enduro bikes and all-mountain bikes with travel greater than 140mm, delivering puncture protection and traction.",
          manufacturers[7],
          made_ins[1],
          categories[4],
          54.95,
          9,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createManufacturers(cb) {
  async.parallel(
    [
      function (callback) {
        manufacturerCreate(
          "Giant",
          "Each of us has our own challenges, goals and reasons to ride. At Giant, our purpose is to help you unleash your full potential no matter the chosen path. We do this with our products, our people and the stories we share. Come feel what it’s like to be limitless. Come ride with us.",
          1972,
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Trek",
          "Trek started in a small Wisconsin barn in 1976, but our founders always saw something bigger. Forty-four years later, we're on a mission to make our world a better place to live and ride. We build only products we love, provide incredible hospitality to our customers, and change the world by getting more people on bikes.",
          1976,
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Cannondale",
          "It was 1971: a year when the world was beginning to change rapidly with an exciting new spirit of digital invention, creativity and imagination along with a worldwide drive for new purpose. A new dawn. And yet, cycling was still very traditional, very conventional, conforming to some sort of rulebook: our founders believed that there had to be a better way.",
          1971,
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Giro",
          "You, doing things that most people wouldn’t even consider. Drawing a line that’s rarely inbounds. Descending at speeds that would give your underwriter pause. Pushing yourself in ways nature and gravity never intended. As long as you’re relentlessly pushing forward, we will too. When you stop, that’s when we’ll stop. We’re obsessing over your passion. Destroying more helmets in testing and development than some brands even create. We’re agonizing over vent sizes and inseam lengths. Pouring our years, our hearts, our sweat, into one insole, one goggle, one helmet at a time. Plainly said, being there when you need us most.",
          1985,
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Dakine",
          "Founded in Hawaii in 1979 and located at the base of Mt. Hood in Hood River, Oregon, Dakine builds backpacks, travel bags, accessories, outerwear and clothing for people who love to surf, snowboard, skateboard, mountain bike, ski, windsurf, kiteboard and travel.",
          1979,
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Camelbak",
          "Bicycle enthusiast Michael Eidson was competing in the Hotter'N Hell 100, and that's exactly what it is to this day: a 100-mile road race, over four days in the grueling summer heat of Wichita Falls, Texas. Water is vital to surviving the race, but there are few places to refill, let alone time to stop. An emergency medical technician by trade, Eidson came up with a solution on the fly: he filled an IV bag with water, slipped it into a white tube sock (yes, an actual tube sock), and stuffed the whole contraption into the back of his bike jersey. He then threw the hose over his shoulder and clamped it shut with a clothespin. Hands-free hydration was born. And CamelBak was created to pursue it.",
          1993,
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Maxxis",
          "Since its founding more than 50 years ago, Maxxis International has been dedicated to making tires riders and drivers can trust for quality and performance. Trust in Maxxis extends from average consumers to professional drivers and riders, who rely on Maxxis tires to win world and national championships, Olympic medals, and more.",
          1970,
          callback
        );
      },
      function (callback) {
        manufacturerCreate(
          "Continental",
          "Continental develops pioneering technologies and services for sustainable and connected mobility of people and their goods. Founded in 1871, the technology company offers safe, efficient, intelligent and affordable solutions for vehicles, machines, traffic and transportation. In 2020, Continental generated sales of €37.7 billion and currently employs more than 192,000 people in 58 countries and markets. On October 8, 2021, the company celebrated its 150th anniversary.",
          1871,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createMadeIns(cb) {
  async.parallel(
    [
      function (callback) {
        made_inCreate("Taiwan", callback);
      },
      function (callback) {
        made_inCreate("USA", callback);
      },
      function (callback) {
        made_inCreate("China", callback);
      },
      function (callback) {
        made_inCreate("Netherlands", callback);
      },
    ],
    // Optional callback
    cb
  );
}
function createCategories(cb) {
  async.parallel(
    [
      function (callback) {
        categoryCreate("Mountain Bikes", callback);
      },
      function (callback) {
        categoryCreate("Road Bikes", callback);
      },
      function (callback) {
        categoryCreate("Safety Gear", callback);
      },
      function (callback) {
        categoryCreate("Miscellaneous", callback);
      },
      function (callback) {
        categoryCreate("Tires", callback);
      },
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createItems, createManufacturers, createMadeIns, createCategories],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("All items: " + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
