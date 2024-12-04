const { User } = require('../models');
const bcrypt = require('bcryptjs');

const userController = {
  async createUser(req, res) {
    try {
      const { firstname, surname, email, password, confirmPassword } = req.body;

      // Validações básicas
      if (!firstname || !surname || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'As senhas não conferem.' });
      }

      // Verificar se o e-mail já está em uso
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'E-mail já cadastrado.' });
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar usuário
      const newUser = await User.create({
        firstname,
        surname,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        id: newUser.id,
        firstname: newUser.firstname,
        surname: newUser.surname,
        email: newUser.email,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

  // Método para obter um usuário pelo ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: { id },
        attributes: ['id', 'firstname', 'surname', 'email'],
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { firstname, surname, email } = req.body;

      // Validações básicas
      if (!firstname || !surname || !email) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }

      // Verificar se o usuário existe
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // Atualizar o usuário
      await user.update({ firstname, surname, email });

      return res.status(204).send(); // Sem conteúdo
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },
  
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Verifica se o usuário existe
      const user = await User.findOne({ where: { id } });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      // Remove o usuário
      await User.destroy({ where: { id } });

      return res.status(204).send(); // No Content
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
};

module.exports = userController;
