import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import mongoose, { mongo } from "mongoose";
import booksRoute from "./routes/booksRoute.js"
import usersRoute from "./routes/usersRoute.js"
import cors from "cors";

const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware per CORS policy
app.use(cors());

//Homepage
app.get('/', (req,res)=>{
    console.log(req);
    return res.status(200).send('Benvenuto su UniRENT')
})

//Middleware per usare booksRoute
app.use('/libri', booksRoute);

//Middleware per usare usersRoute
app.use('/users', usersRoute);

mongoose.connect(mongoDBURL)
    .then(()=>{
        console.log('App connected to database')
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        })
    }).catch((error)=>{
        console.log(error);
    });
