const express = require("express");
const app = express();

//1. import routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");//fronend ->3000 ,backend ->4000 ..and  i want backend to entertain frontend request..so it needed cors..[install]
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");//make sure all are installed [see in package.json]
const dotenv = require("dotenv");

const PORT = process.env.PORT || 4000;

dotenv.config();//load dotenv config
//2. database connect using connect fxn
database.connect();//
//3. middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",  //FOR FRONTEND....VVI..to entertain frontend req.
    credentials: true,
  })
);
app.use(fileUpload({ //-_-   //,
  useTempFiles : true,
  tempFileDir : '/tmp/'  //, --_--
}));
// app.use(fileUpload({
//   useTempFiles : true,
//   tempFileDir : '/tmp/'
// }));
// cloudinary  connection
cloudinaryConnect();
//4. routes mount..
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);
//5. default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: 'Your server is up and running....',
  });
});
//6. server activate[[VVi]]
app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`)
});
