import request from 'supertest';
import express, { json } from 'express';
import booksRoute from "../routes/booksRoute.js" 
import { Book } from '../models/bookModel';

const app = express();
app.use(json());
app.use('/libri', booksRoute);

// Mock del metodo `create` di Mongoose per evitare chiamate al database
jest.mock('../models/bookModel', () => ({
  Book: {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe('Test delle route', () => {
  // Test per la route '/'
  describe('POST /', () => {
    test('dovrebbe restituire uno stato 201 e i dati del libro aggiunto', async () => {
      // Configura il mock per restituire un libro appena aggiunto
      const mockBook = { titolo: 'Libro Test', autore: 'Autore Test', corso: 'Corso Test', anno: 2024, genere: 'Genere Test', disponibilita: 2 };
      Book.create.mockResolvedValue(mockBook);

      const response = await request(app)
        .post('/libri/')
        .send(mockBook);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockBook);
    });

    test('dovrebbe restituire uno stato 400 se i campi richiesti non sono forniti', async () => {
      const response = await request(app)
        .post('/libri/')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Mandare tutti i campi richiesti');
    });

    test('dovrebbe gestire gli errori interni del server', async () => {
      // Configura il mock per simulare un errore durante la creazione del libro
      Book.create.mockRejectedValue(new Error('Errore interno del server'));

      const response = await request(app)
        .post('/libri/')
        .send({ titolo: 'Libro Test', autore: 'Autore Test', corso: 'Corso Test', anno: 2024, genere: 'Genere Test', disponibilita: 2  });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Errore interno del server');
    });
  });

  // Test per la route '/'
  describe('GET /', () => {
    test('dovrebbe restituire uno stato 201 e un elenco di libri', async () => {
      // Configura il mock per restituire un elenco di libri
      const mockBooks = [
        { titolo: 'Libro 1', autore: 'Autore 1', corso: 'Corso 1', anno: 2024, genere: 'Genere 1', disponibilita: 2 },
        { titolo: 'Libro 2', autore: 'Autore 2', corso: 'Corso 2', anno: 2024, genere: 'Genere 2', disponibilita: 2 },
      ];
      Book.find.mockResolvedValue(mockBooks);

      const response = await request(app).get('/libri/');

      expect(response.status).toBe(201);
      expect(response.body.count).toBe(mockBooks.length);
      expect(response.body.data).toEqual(mockBooks);
    });

    test('dovrebbe gestire gli errori interni del server', async () => {
      // Configura il mock per simulare un errore durante la ricerca dei libri
      Book.find.mockRejectedValue(new Error('Errore interno del server'));

      const response = await request(app).get('/libri/');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Errore interno del server');
    });
  });

  // Test per la route '/:id'
  describe('DELETE /:id', () => {
    test('dovrebbe restituire uno stato 200 e un messaggio di libro eliminato', async () => {
      // Configura il mock per restituire la cancellazione di un libro
      const mockBookId = '1234567890';
      Book.findByIdAndDelete.mockResolvedValue({ _id: mockBookId });

      const response = await request(app).delete(`/libri/${mockBookId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Libro eliminato');
    });

    test('dovrebbe restituire uno stato 404 se il libro non è trovato', async () => {
      // Configura il mock per restituire un risultato nullo (libro non trovato)
      Book.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app).delete('/libri/nonEsistenteId');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Libro non trovato');
    });

    test('dovrebbe gestire gli errori interni del server', async () => {
      // Configura il mock per simulare un errore durante la cancellazione del libro
      Book.findByIdAndDelete.mockRejectedValue(new Error('Errore interno del server'));

      const response = await request(app).delete('/libri/1234567890');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Errore interno del server');
    });
  });
});
