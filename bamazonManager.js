var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
})

function readProducts() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " 
        + "Price: $" + res[i].price + " | " + "In stock: " + res[i].stock_quantity);
      }
      console.log("-----------------------------------");
    });
}

function start() {
    inquirer
      .prompt({
        name: "productID",
        type: "list",
        message: "What would you like to do?",
        choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product"]
      })
      .then(function(answer) {

      });
}