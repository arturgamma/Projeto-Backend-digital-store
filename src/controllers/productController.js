const { Association } = require('sequelize');
const { Product, Category, ProductOptions, ProductImage } = require('../models');

module.exports = {
  async getProductById(req, res) {
    try {
      const Productid = req.params.id;

      const product = await Product.findOne({
        where: { id: Productid },
        include: [
          {model: Category,
            as: 'categories',
            attributes: ['id', 'name'],
            through: { attributes: [] }, //não mostra ProductCategories
          },
          {
            model: ProductOptions,  
            as: 'options',  
            attributes: ['id', 'values'],
          },
          {
            model: ProductImage,  
            as: 'images',  
            attributes: ['id', 'path'],
          }
        ],
      });

      if (!Product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      const response = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        slug: product.slug,
        use_in_menu: product.use_in_menu,
        category: product.categories.map((category) => category.name),
        options: product.options.map((option) => option.values),
        images: product.images.map((image) => image.path),
      }  

      return res.status(200).json(response);

    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return res.status(400).json({ error: 'Requisição inválida' });
    }
  },

  async createProduct(req, res) {
    try {
      const {
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
        category_ids,
        images,
        options
      } = req.body;

      // Verificar se os dados obrigatórios estão presentes
      if (!name || !slug || !price || !category_ids) {
        return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
      }

      // Criar o produto
      const product = await Product.create({
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount
      });

      // Associar as categorias ao produto
      if (category_ids && category_ids.length > 0) {
        await product.setCategories(category_ids); // Associa as categorias ao produto
      }

      // Armazenar imagens, se existirem
      if (images && images.length > 0) {
        const imagePromises = images.map(image =>
          ProductImage.create({
            product_id: product.id,
            type: image.type,
            content: image.content // Armazenar a imagem em base64 (ou pode ser salva em disco)
          })
        );
        await Promise.all(imagePromises);
      }

      // Criar opções de produto, se existirem
      if (options && options.length > 0) {
        const optionPromises = options.map(option =>
          ProductOption.create({
            product_id: product.id,
            title: option.title,
            shape: option.shape,
            type: option.type,
            values: JSON.stringify(option.value || option.values) // Armazenar como JSON
          })
        );
        await Promise.all(optionPromises);
      }

      // Retornar o produto recém-criado
      return res.status(201).json({
        id: product.id,
        name: product.name,
        slug: product.slug,
        stock: product.stock,
        description: product.description,
        price: product.price,
        price_with_discount: product.price_with_discount
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(400).json({ error: 'Erro ao criar produto' });
    }
  },

  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const {
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount,
        category_ids,
        images,
        options
      } = req.body;

      // Verificar se o produto existe
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Atualizar as informações do produto
      await product.update({
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount
      });

      // Atualizar as categorias associadas ao produto
      if (category_ids && category_ids.length > 0) {
        await product.setCategories(category_ids); // Associa as novas categorias
      }

      // Atualizar as imagens associadas ao produto
      if (images && images.length > 0) {
        const imagePromises = images.map(async (image) => {
          if (image.deleted) {
            // Remover a imagem se marcada como deletada
            await ProductImage.destroy({ where: { id: image.id } });
          } else {
            // Atualizar ou adicionar novas imagens
            if (image.id) {
              await ProductImage.update(
                { content: image.content || image.type }, // Atualiza o conteúdo da imagem
                { where: { id: image.id } }
              );
            } else {
              await ProductImage.create({
                product_id: product.id,
                type: image.type,
                content: image.content
              });
            }
          }
        });
        await Promise.all(imagePromises);
      }

      // Atualizar as opções associadas ao produto
      if (options && options.length > 0) {
        const optionPromises = options.map(async (option) => {
          if (option.deleted) {
            // Remover a opção se marcada como deletada
            await ProductOption.destroy({ where: { id: option.id } });
          } else {
            // Atualizar ou adicionar novas opções
            if (option.id) {
              await ProductOption.update(
                { title: option.title, shape: option.shape, type: option.type, values: JSON.stringify(option.values || option.value) },
                { where: { id: option.id } }
              );
            } else {
              await ProductOption.create({
                product_id: product.id,
                title: option.title,
                shape: option.shape,
                type: option.type,
                values: JSON.stringify(option.values || option.value)
              });
            }
          }
        });
        await Promise.all(optionPromises);
      }

      // Retornar resposta com status 204 (sem corpo)
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(400).json({ error: 'Erro ao atualizar produto' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;

      // Verificar se o produto existe
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      // Deletar o produto
      await product.destroy();

      // Retornar resposta com status 204 (sem corpo)
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      return res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  },

  async searchCategories(req, res) {
    try {
      // Definindo valores padrões
      const limit = req.query.limit ? parseInt(req.query.limit) : 12;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const fields = req.query.fields ? req.query.fields.split(',') : ['id', 'name', 'slug', 'use_in_menu'];
      const useInMenu = req.query.use_in_menu === 'true'; // Filtra categorias que podem ser usadas no menu

      // Verificando se o valor de limit é válido
      if (limit < -1 || limit === 0) {
        return res.status(400).json({ error: 'O parâmetro "limit" deve ser maior que 0 ou igual a -1 para buscar todos os itens' });
      }

      // Filtro para a query
      const where = useInMenu ? { use_in_menu: true } : {};

      // Buscando categorias com base nos filtros
      const categories = await Category.findAndCountAll({
        where,
        attributes: fields,  // Limitando os campos a serem retornados
        limit: limit === -1 ? undefined : limit, // Quando limit for -1, retorna todos os itens
        offset: limit === -1 ? 0 : (page - 1) * limit, // Calcula o offset para paginação
      });

      // Construindo a resposta
      const response = {
        data: categories.rows,
        total: categories.count,
        limit: limit,
        page: page,
      };

      return res.status(200).json(response);

    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return res.status(400).json({ error: 'Erro ao processar a requisição' });
    }
  },
};
