import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import dotenv from "dotenv"
import userRoute from './routes/user.route.js'
import companyRoute from './routes/company.route.js'
import jobRoute from './routes/job.route.js'
import applicationRoute from './routes/application.route.js'

import connectDB from "./utils/db.js";
dotenv.config();
const app = express();

//  app.get("/home", (req,res) => {  //res.json({...}) sends data back to the client in JSON (JavaScript Object Notation) format, which is commonly used in web APIs.
//     return res.status(200).json({
//         message:"I am coming from backend",
//         success:true,
//     })
//  })


// middlewear
app.use(express.json());
app.use(express.urlencoded({extended:true}));  // used to handle data sent from HTML forms.
app.use(cookieParser());

const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true,
}
app.use(cors(corsOptions));


const PORT = process.env.PORT || 3000;

// api 's
//   "http://localhost:8000/api/v1/user/register"
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);


app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
    
})