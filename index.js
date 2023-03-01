const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
const mongoose = require("mongoose");
const mongoURL =
  "mongodb+srv://GoFood:0000@cluster0.r0tlhrm.mongodb.net/GoFoody?retryWrites=true&w=majority";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hlo");
});
app.use(cors());

app.use("/api", require("./Routes/CreateUser.js"));
app.use("/api", require("./Routes/Displaydata.js"));
app.use("/api", require("./Routes/OrderData.js"));

app.listen(port, () => {
  console.log("port is connected");
});

mongoose.set("strictQuery", true);
mongoose.connect(mongoURL, { useNewUrlParser: true }, async (err, result) => {
  if (err) console.log(err);
  else {
    console.log("connected");

    const fetchedData = await mongoose.connection.db.collection("foodyDatas");
    fetchedData.find({}).toArray(async function (err, data) {
      const foodCategory = await mongoose.connection.db.collection(
        "foodyCategory"
      );
      foodCategory.find({}).toArray(function (err, cdata) {
        if (err) console.log(err);
        else {
          //console.log(cdata)
          global.foodyDatas = data;
          global.foodyCategory = cdata;
        }
      });
    });
  }
});
