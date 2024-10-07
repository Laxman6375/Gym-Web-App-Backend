const express = require("express");
const app = express();
const ConnectDB = require("./config/database")
const cookieParser = require("cookie-parser");
const cors = require("cors");


//routes
const userRoutes = require("./routes/User")

ConnectDB();
const PORT = process.env.PORT || 4000

app.use(express.json()); 
app.use(cookieParser());
app.use(
  cors({
    origin: ["*"],
  })
);

app.use("/auth",userRoutes)

app.get("/", (req, res) => {
    return res.json({
      success: true,
      message: "Your server is up and running....",
    });
  });

  app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
  });