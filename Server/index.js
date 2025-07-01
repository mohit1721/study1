const express = require("express");
const app = express();
const fs = require("fs");
const rateLimit = require("express-rate-limit");

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
const path = require("path");
const PORT = process.env.PORT || 4000;
// const { serveCertificates } = require("./controllers/certificateController");

dotenv.config();//load dotenv config
//2. database connect using connect fxn
database.connect();//

// Rate limiting middleware (limit to 100 requests per 5 minutes)
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  headers: true, // Send rate limit info in headers
});

// Apply rate limiter to all requests
app.use(limiter);
// The rateLimit middleware is applied globally, limiting each IP to 100 requests per 5 minutes.


// serveCertificates(app);
// app.get("/", (req, res) => { 
//   try {    
//      database.connect();
//     return res.json({
//       success: true,
//       message: 'Your server is up and running....',
//     });
//   } catch (error) {
//      // Step 3: Error ko handle karein
//      console.error("Error connecting to database:", error);
//      return res.status(500).json({
//        success: false,
//        message: 'Server mein kuch issue hai, please try again later.',
//      });
//   }
// });

//3. middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin:[ "http://localhost:3000", "https://mylernix.vercel.app"],//"*",  //FOR FRONTEND..//  methods: ["GET", "POST", "PUT", "DELETE"],..VVI..to entertain frontend req.[[http://localhost:3000]] -->:["http://localhost:3000","https://mylernix.vercel.app","https://study1-jlkmw7ckr-mohit1721s-projects.vercel.app"], --------------------------["https://myLernix.vercel.app"]  
    credentials: true,
  })
);
app.use(fileUpload({ //-_-   //,
  useTempFiles : true,
  tempFileDir : '/tmp/'  //, --_--
}));
// Ensure certificates directory exists
const certificatesDir = path.join(__dirname, "certificates");
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
}

// Serve certificates as static files
app.use("/certificates", express.static(certificatesDir));
// app.use(fileUpload({
//   useTempFiles : true,
//   tempFileDir : '/tmp/'
// }));
// cloudinary  connection
cloudinaryConnect();
// Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
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


// app.get("/",async (req, res) => {
//   try {
    
//    await database.connect();
//     return res.json({
//       success: true,
//       message: 'Your server is up and running....',
//     });
//   } catch (error) {
//      // Step 3: Error ko handle karein
//      console.error("Error connecting to database:", error);
//      return res.status(500).json({
//        success: false,
//        message: 'Server mein kuch issue hai, please try again later.',
//      });
//   }
  
// });

// app.get("/", (req, res) => {
//   app.use(express.static(path.resolve(__dirname, "src", "build")));
//   res.sendFile(path.resolve(__dirname, "src", "build", "index.html"));
//   });
//6. server activate[[VVi]]
app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`)
});
module.exports=app
