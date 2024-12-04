const request = require('supertest');
const app = require('../app'); 
const { User } = require('../models');
const bcrypt = require('bcryptjs');

jest.mock('../models'); 

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users (createUser)', () => {
    it('deve criar um usuário com sucesso', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        id: 1,
        firstname: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
      });

      const response = await request(app)
        .post('/users')
        .send({
          firstname: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          password: '123456',
          confirmPassword: '123456',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        firstname: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
      });
    });

    it('deve retornar erro se as senhas não conferem', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          firstname: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          password: '123456',
          confirmPassword: '654321',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'As senhas não conferem.' });
    });

    it('deve retornar erro se o email já estiver cadastrado', async () => {
      User.findOne.mockResolvedValue({ id: 1, email: 'john.doe@example.com' });

      const response = await request(app)
        .post('/users')
        .send({
          firstname: 'John',
          surname: 'Doe',
          email: 'john.doe@example.com',
          password: '123456',
          confirmPassword: '123456',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'E-mail já cadastrado.' });
    });
  });

  describe('GET /users/:id (getUserById)', () => {
    it('deve retornar um usuário existente', async () => {
      User.findOne.mockResolvedValue({
        id: 1,
        firstname: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
      });

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        firstname: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
      });
    });

    it('deve retornar erro 404 se o usuário não existir', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
    });
  });

  describe('PUT /users/:id (updateUser)', () => {
    it('deve atualizar um usuário existente', async () => {
      User.findByPk.mockResolvedValue({
        id: 1,
        update: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app)
        .put('/users/1')
        .send({
          firstname: 'Jane',
          surname: 'Doe',
          email: 'jane.doe@example.com',
        });

      expect(response.status).toBe(204);
    });

    it('deve retornar erro 404 se o usuário não existir', async () => {
      User.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/users/1')
        .send({
          firstname: 'Jane',
          surname: 'Doe',
          email: 'jane.doe@example.com',
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Usuário não encontrado.' });
    });
  });

  describe('DELETE /users/:id (deleteUser)', () => {
    it('deve deletar um usuário existente', async () => {
      User.findOne.mockResolvedValue({ id: 1 });
      User.destroy.mockResolvedValue(true);

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(204);
    });

    it('deve retornar erro 404 se o usuário não existir', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Usuário não encontrado.' });
    });
  });
});
