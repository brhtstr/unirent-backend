import express from "express";
import { User } from "../models/userModel.js";

const router = express.Router();

//Route per login
router.post('/login', async (req,res)=>{
    try {
        const utente = await User.find({email: req.body.email});
        const user = utente[0];
        if(!user){
            return res.status(404).send('Utente non trovato')
        }

        if (req.body.password != user.password) {
            return res.status(400).json({message: 'Credenziali non valide'});
        }

        return res.status(200).send({ message: "Login effettuato" });
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({message: error.message});
    }
    
    
})

//Route per logout
router.get('/logout', (req,res)=>{
    res.redirect('/')
})

export default router;