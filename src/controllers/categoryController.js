const { Category, Op } = require('../models');

module.exports = {
  async searchCategories(req, res) {
    try {
      const {
        limit = 12,
        page = 1,
        fields = 'id,name,slug,use_in_menu',
        use_in_menu,
      } = req.query;

      // Parse de parâmetros
      const parsedLimit = parseInt(limit, 10);
      const parsedPage = parseInt(page, 10);
      const offset = parsedLimit > 0 ? (parsedPage - 1) * parsedLimit : null;

      // Seleção de campos
      const selectedFields = fields.split(',').filter((field) =>
        ['id', 'name', 'slug', 'use_in_menu'].includes(field)
      );

      // Filtros
      const filters = {};
      if (use_in_menu === 'true') filters.use_in_menu = true;
      if (use_in_menu === 'false') filters.use_in_menu = false;

      // Busca no banco de dados
      const { count, rows } = await Category.findAndCountAll({
        where: filters,
        attributes: selectedFields.length > 0 ? selectedFields : null,
        limit: parsedLimit > 0 ? parsedLimit : null,
        offset: parsedLimit > 0 ? offset : null,
      });

      // Resposta
      return res.status(200).json({
        data: rows,
        total: count,
        limit: parsedLimit,
        page: parsedPage,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  },

    async getCategoryById (req, res) {
        try {
            const { id } = req.params;

            // Buscar a categoria pelo ID
            const category = await Category.findOne({
            where: { id },
            attributes: ['id', 'name', 'slug', 'use_in_menu'], // Campos que você deseja retornar
            });

            if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
            }

            return res.status(200).json(category);
        } catch (error) {
            console.error('Erro ao buscar categoria:', error);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    },

    async createCategory (req, res){
        try {
          const { name, slug, use_in_menu } = req.body;
      
          // Validações básicas
          if (!name || !slug || use_in_menu === undefined) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
          }
      
          // Verificar se o slug já está em uso
          const existingCategory = await Category.findOne({ where: { slug } });
          if (existingCategory) {
            return res.status(400).json({ error: 'Slug já está em uso.' });
          }
      
          // Criar a nova categoria
          const newCategory = await Category.create({ name, slug, use_in_menu });
      
          return res.status(201).json({
            id: newCategory.id,
            name: newCategory.name,
            slug: newCategory.slug,
            use_in_menu: newCategory.use_in_menu,
          });
        } catch (error) {
          console.error('Erro ao criar categoria:', error);
          return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }, 

    async updateCategory(req, res){
        try {
          const { id } = req.params;
          const { name, slug, use_in_menu } = req.body;
      
          // Validações básicas
          if (!name || !slug || use_in_menu === undefined) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
          }
      
          // Verificar se a categoria existe
          const category = await Category.findOne({ where: { id } });
          if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
          }
      
          // Verificar se o slug já está em uso por outra categoria
          const existingCategory = await Category.findOne({
            where: { slug }
          });
      
          if (existingCategory && existingCategory.id != id) {
            console.log(existingCategory.id)
            return res.status(400).json({ error: 'Slug já está em uso por outra categoria.' });
          }
      
          // Atualizar a categoria
          category.name = name;
          category.slug = slug;
          category.use_in_menu = use_in_menu;
      
          await category.save();
      
          // Resposta com status 204 (sem conteúdo)
          return res.status(204).send();
        } catch (error) {
          console.error('Erro ao atualizar categoria:', error);
          return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }, 

    async deleteCategory(req, res){
        const { id } = req.params;
        try{
        // Tentar encontrar a categoria no banco de dados
        const category = await Category.findByPk(id);

        if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
        }
    

        // Deletar a categoria
        await Category.destroy({ where: { id } });

        return res.status(204).send(); // Retorna 204 No Content, pois a exclusão foi bem sucedida   
        } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
    
    
};
