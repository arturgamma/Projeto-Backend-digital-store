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

      if (!name || !slug || !price || !category_ids) {
        return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
      }

      const product = await Product.create({
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount
      });

      if (category_ids && category_ids.length > 0) {
        await product.setCategories(category_ids); // Associa as categorias ao produto
      }

      if (images && images.length > 0) {
        const imagePromises = images.map(image =>
          ProductImage.create({
            product_id: product.id,
            type: image.type,
            content: image.content 
          })
        );
        await Promise.all(imagePromises);
      }

      if (options && options.length > 0) {
        const optionPromises = options.map(option =>
          ProductOption.create({
            product_id: product.id,
            title: option.title,
            shape: option.shape,
            type: option.type,
            values: JSON.stringify(option.value || option.values) // Armazenar c/ JSON
          })
        );
        await Promise.all(optionPromises);
      }

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

      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      await product.update({
        enabled,
        name,
        slug,
        stock,
        description,
        price,
        price_with_discount
      });

      if (category_ids && category_ids.length > 0) {
        await product.setCategories(category_ids); 
      }

      if (images && images.length > 0) {
        const imagePromises = images.map(async (image) => {
          if (image.deleted) {
           
            await ProductImage.destroy({ where: { id: image.id } });
          } else {
         
            if (image.id) {
              await ProductImage.update(
                { content: image.content || image.type }, 
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

      if (options && options.length > 0) {
        const optionPromises = options.map(async (option) => {
          if (option.deleted) {
           
            await ProductOption.destroy({ where: { id: option.id } });
          } else {
            
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

      
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(400).json({ error: 'Erro ao atualizar produto' });
    }
  },

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;

      
      const product = await Product.findByPk(productId);

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      await product.destroy();

      
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      return res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  },

  async searchCategories(req, res) {
    try {
      
      const limit = req.query.limit ? parseInt(req.query.limit) : 12;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const fields = req.query.fields ? req.query.fields.split(',') : ['id', 'name', 'slug', 'use_in_menu'];
      const useInMenu = req.query.use_in_menu === 'true'; 

      
      if (limit < -1 || limit === 0) {
        return res.status(400).json({ error: 'O parâmetro "limit" deve ser maior que 0 ou igual a -1 para buscar todos os itens' });
      }

      
      const where = useInMenu ? { use_in_menu: true } : {};

      
      const categories = await Category.findAndCountAll({
        where,
        attributes: fields,  
        limit: limit === -1 ? undefined : limit, 
        offset: limit === -1 ? 0 : (page - 1) * limit, 
      });

      
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
