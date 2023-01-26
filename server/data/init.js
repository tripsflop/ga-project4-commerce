const SneaksAPI = require("sneaks-api");
const Product = require("../models/product.js");

const mongoose = require("mongoose");
const result = require("dotenv").config({
  path: "/Users/zhengkai/Documents/project4/ga-project4-commerce/server/.env",
});
const MONGO_URI = process.env.MONGO_URI;

const db = mongoose.connection;

mongoose.connect(MONGO_URI);
mongoose.set("runValidators", true);
mongoose.set("debug", true);

// check dot env
if (result.error) {
  console.log(result.error);
}

// check mongodb connection status
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", MONGO_URI));
db.on("disconnected", () => console.log("mongo disconnected"));

const sneaks = new SneaksAPI();

const brands = [
  "Nike Dunk High",
  "Nike Dunk Mid",
  "Nike Dunk Low",
  "Nike Air Force 1",
  "Jordan 1",
  "Jordan 2",
  "Jordan 3",
  "Jordan 4",
  "Jordan 5",
  "Jordan 6",
  "Jordan 7",
  "Jordan 8",
  "Jordan 9",
  "Jordan 10",
  "Jordan 11",
  "Jordan 12",
  "Jordan 13",
  "Jordan 14",
  "Jordan 15",
  "Jordan 16",
  "Jordan 17",
  "Jordan 18",
  "Jordan 19",
  "Nike SB Dunk Low",
  "Nike SB Dunk High",
  "Nike Air Max",
  "Yeezy",
  "NMD",
  "Superstar",
  "UltraBoost",
  "New Balance",
  "Converse",
  "ASICS",
  "Puma",
  "Reebok",
  "Vans",
];

const count = 50;
const fs = require("fs");

async function getSneakers(save, search, count) {
  await sneaks.getProducts(search, count, async function (err, products) {
    if (err) {
      console.log(err);
    }
    const value = await save(products);
    const data = JSON.stringify(value);
    fs.writeFile("data.json", data, (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved");
    });
  });
}

function saveData(item) {
  let arr = [];
  item.map((element) => {
    let picked = (({
      brand,
      shoeName,
      silhoutte,
      colorway,
      retailPrice,
      thumbnail,
      releaseDate,
      description,
      make,
      urlKey,
    }) => ({
      brand,
      shoeName,
      silhoutte,
      colorway,
      retailPrice,
      thumbnail,
      releaseDate,
      description,
      make,
      urlKey,
    }))(element);

    picked.releaseYear = picked.releaseDate.substring(0, 4);

    picked.sizes = {
      4: Math.floor(Math.random() * 20),
      4.5: Math.floor(Math.random() * 20),
      5: Math.floor(Math.random() * 20),
      5.5: Math.floor(Math.random() * 20),
      6: Math.floor(Math.random() * 20),
      6.5: Math.floor(Math.random() * 20),
      7: Math.floor(Math.random() * 20),
      7.5: Math.floor(Math.random() * 20),
      8: Math.floor(Math.random() * 20),
      8.5: Math.floor(Math.random() * 20),
      9: Math.floor(Math.random() * 20),
      9.5: Math.floor(Math.random() * 20),
      10: Math.floor(Math.random() * 20),
      10.5: Math.floor(Math.random() * 20),
      11: Math.floor(Math.random() * 20),
      11.5: Math.floor(Math.random() * 20),
      12: Math.floor(Math.random() * 20),
      12.5: Math.floor(Math.random() * 20),
      13: Math.floor(Math.random() * 20),
      13.5: Math.floor(Math.random() * 20),
      14: Math.floor(Math.random() * 20),
    };
    arr.push(picked);
  });
  // console.log(arr);
  return arr;
}
function insertDB() {
  fs.readFile("data.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      const jsonData = JSON.parse(jsonString);
      Product.insertMany(jsonData)
        .then(() => {
          console.log("data inserted");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
  });
}

insertDB();

//getSneakers(saveData, "Nike Dunk", 50);

// for (brand of brands) {
//   getSneakers(saveData, brand, count);
// }

// sneaks.getProductPrices("FY2903", (err, product) => {
//   console.log(product);
// });
