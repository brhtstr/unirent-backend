import express from "express";
import { Book } from "../models/bookModel.js";

const router = express.Router();

//Route per aggiungere libro
router.post('/', async (req,res) => {
    try {
        if (
            !req.body.titolo ||
            !req.body.autore ||
            !req.body.corso ||
            !req.body.anno ||
            !req.body.genere ||
            !req.body.disponibilita
        ) {
            return res.status(400).send({
                message: "Mandare tutti i campi richiesti",
            });
        }
        const newBook = {
            titolo: req.body.titolo,
            autore: req.body.autore,
            corso: req.body.corso,
            anno: req.body.anno,
            genere: req.body.genere,
            disponibilita: req.body.disponibilita,
        };

        const book = await Book.create(newBook);

        return res.status(201).send(book);
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({message: error.message});
    }
});

//Route per avere elenco dei libri
router.get('/', async (req,res) => {
    try { 
        const books = await Book.find({});

        return res.status(201).json({
            count: books.length,
            data: books
        });
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({message: error.message});
    }
});

//Route per eliminare un libro
router.delete('/:id', async (req,res) => {
    try { 
        const {id} = req.params;

        const result = await Book.findByIdAndDelete(id);

        if(!result){
            return res.status(404).json({ message: "Libro non trovato" });
        }

        return res.status(200).send({ message: "Libro eliminato" });

    } catch (error) {
        console.log(error.message)
        res.status(500).send({message: error.message});
    }
});

export default router;