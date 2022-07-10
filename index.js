require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const app = express();
const port = 3333;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

(async () => {
  try {
    const connection = mongoose.connect(
      "mongodb://127.0.0.1:27017/customerRecord"
    );
    mongoose.connection.on("error", (err) => {
      console.log("error", err);
    });
  } catch (err) {
    console.log(err);
  }
})();

app.use((req, res, next) => {
  console.log(req.hostname);
  next();
});

const customerSchema = new Schema({
  product_name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  card_type: {
    type: String,
    required: true,
  },
  card_number: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

const CustomerRecord = mongoose.model("Customer", customerSchema);

app.get("/api/v1/customers", (req, res, next) => {
  const id = req.params.id;
  console.log("id", id);
  CustomerRecord.find({}).exec((err, recs) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(recs);
  });
});

app.get("/api/v1/customers/:id", async (req, res, next) => {
  const id = req.params.id;
  console.log("id", id);
  let record = await CustomerRecord.findOne({ _id: id }).exec((err, rec) => {
    if (err) return res.status(500).send(err);
    res.status(200).json(rec);
  });
  //res.render("public/updateRecord");
});

app.post("/api/v1/customers", (req, res, next) => {
  console.log(req.body);
  const newCustomer = new CustomerRecord(req.body);
  newCustomer.save((err, rec) => {
    if (err) return res.status(500).send(err);
    res.status(201).json(rec);
  });
});

app.put("/api/v1/customers/:id", (req, res, next) => {
  console.log("my log", req.params.id);
  const customerId = req.params.id;
  const updates = req.body;

  CustomerRecord.updateOne({ _id: customerId }, updates, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.delete("/api/v1/customers/:id", (req, res) => {
  const id = req.params.id;
  CustomerRecord.deleteOne({ _id: id }, (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

app.get("/redirect", (req, res) => {
  res.redirect("/about.html");
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
