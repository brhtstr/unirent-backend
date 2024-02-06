import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
    {
        titolo:{
            type: String,
            required: true,
        },
        autore:{
            type: String,
            required: true,
        },
        corso:{
            type: String,
            required: true,
        },
        anno:{
            type: Number,
            required: true,
        },
        genere:{
            type: String,
            required: true,
        },
        disponibilita:{
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Book = mongoose.model('Book', bookSchema);