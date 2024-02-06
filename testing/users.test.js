import request from 'supertest';
import express, { json } from 'express';
import usersRoute from "../routes/usersRoute.js"
import { User } from '../models/userModel.js';

const app = express();
app.use(json());
app.use('/users', usersRoute);

// Mock del metodo `find` di Mongoose per evitare chiamate al database
jest.mock('../models/userModel', () => ({
  User: {
    find: jest.fn(),
  },
}));

describe('Test delle route', () => {
  // Test per la route '/login'
  describe('POST /login', () => {
    test('dovrebbe restituire uno stato 200 e un messaggio di login effettuato', async () => {
      // Configura il mock per restituire un utente esistente
      User.find.mockResolvedValue([{ email: 'test@example.com', password: 'password123' }]);

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login effettuato');
    });

    test('dovrebbe restituire uno stato 404 se l\'utente non è trovato', async () => {
      // Configura il mock per restituire un array vuoto (utente non trovato)
      User.find.mockResolvedValue([]);

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'nonEsistente@example.com', password: 'password123' });

      expect(response.status).toBe(404);
      expect(response.text).toBe('Utente non trovato');
    });

    test('dovrebbe restituire uno stato 400 se le credenziali non sono valide', async () => {
      // Configura il mock per restituire un utente esistente, ma con password errata
      User.find.mockResolvedValue([{ email: 'test@example.com', password: 'passwordCorretta' }]);

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'test@example.com', password: 'passwordErrata' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Credenziali non valide');
    });

    test('dovrebbe gestire gli errori interni del server', async () => {
      // Configura il mock per simulare un errore durante la ricerca dell'utente
      User.find.mockRejectedValue(new Error('Errore interno del server'));

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Errore interno del server');
    });
  });

  // Test per la route '/logout'
  describe('GET /logout', () => {
    test('dovrebbe reindirizzare alla home', async () => {
      const response = await request(app).get('/users/logout');

      expect(response.status).toBe(302); // Codice di stato 302 per il reindirizzamento
      expect(response.header['location']).toBe('/');
    });
  });
});
