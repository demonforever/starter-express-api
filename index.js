const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const healthdata = new mongoose.Schema({
    MQ2: String,
    MQ5: String,
    MQ6: String,
    MQ7: String,    
});

const Healthdata = mongoose.model("Healthdata", healthdata);

app.get("/update", async (req, res) => {
  try {
    const data = {
      MQ2: req.query.MQ2,
      MQ5: req.query.MQ5,
      MQ6: req.query.MQ6,
      MQ7: req.query.MQ7,      
    };
    await Healthdata.create(data);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});


app.get("/api/patient", async (req, res) => {
    try{
        const data = await Healthdata.find({}).exec();
        res.json(data);
    }catch(err){
        console.log(err);
    }
})

app.put("/api/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const result = await Healthdata.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})
