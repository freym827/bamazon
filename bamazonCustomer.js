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
    readProducts()
})

function readProducts() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " 
        + "Price: $" + res[i].price + " | " + "In stock: " + res[i].stock_quantity);
      }
      console.log("-----------------------------------");
      start(res.length);
    });
}

function start(length) {
    inquirer
      .prompt({
        name: "productID",
        type: "input",
        message: "What is the ID of the desired product?",
      })
      .then(function(answer) {
        if (Number(answer.productID) < 1 || Number(answer.productID) > length || 
        isNaN(Number(answer.productID)) || Number.isInteger(Number(answer.productID)) == false) {
          console.log("That is not an ID of a product")
          start(length);
        }
        else {
            units(answer.productID)
        }
      });
}

function units(productID) {
    inquirer
      .prompt({
        name: "unitnum",
        type: "input",
        message: "How many units would you like to purchase?",
      })
      .then(function(answer) {
        if (Number(answer.unitnum) < 1 || isNaN(Number(answer.unitnum)) || Number.isInteger(Number(answer.unitnum)) == false) {
          console.log("Answer must be a positive integer")
          units(productID)
        }
        else {
            purchase(productID, answer.unitnum)
        }
      });
}

function purchase(productID, unitnum) {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function(err, res) {
        product = res[Number(productID - 1)]
        if(Number(product.stock_quantity) < unitnum) {
            console.log("Sorry, we do not have " + unitnum + " " + product.product_name + "s for sale.")
        } else {
            console.log("The total cost of your purchase of " + unitnum + " " + product.product_name 
            + "s is " + "$" + (Number(product.price) * Number(unitnum)))
            updateproducts(productID, Number(product.stock_quantity)-Number(unitnum))
        }
    });
}

function updateproducts(productID, newnum) {
    var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";
    connection.query(query, [newnum, productID]);
}
  