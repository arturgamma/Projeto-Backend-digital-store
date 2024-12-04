const request = require('supertest'); // Para simular requisições HTTP
const { Product, Category, ProductOptions, ProductImage } = require('../../src/models');
const productController = require('../../src/controllers/productController');


jest.mock('../../src/models', () => ({
  Product: {
    findOne: jest.fn(),
  },
  Category: jest.fn(),
  ProductOptions: jest.fn(),
  ProductImage: jest.fn(),
}));

describe('Product Controller', () => {
  describe('getProductById', () => {
    test('Deve retornar o produto com sucesso (200)', async () => {
      
      Product.findOne.mockResolvedValue({
        id: 1,
        name: 'Produto Teste',
        description: 'Descrição do Produto Teste',
        price: 100,
        stock: 10,
        slug: 'produto-teste',
        use_in_menu: true,
        categories: [{ name: 'Categoria 1' }, { name: 'Categoria 2' }],
        options: [{ values: 'Opção 1' }, { values: 'Opção 2' }],
        images: [{ path: '/path/image1.jpg' }, { path: '/path/image2.jpg' }],
      });

      const req = { params: { id: 1 } }; 
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        name: 'Produto Teste',
        description: 'Descrição do Produto Teste',
        price: 100,
        stock: 10,
        slug: 'produto-teste',
        use_in_menu: true,
        category: ['Categoria 1', 'Categoria 2'],
        options: ['Opção 1', 'Opção 2'],
        images: ['/path/image1.jpg', '/path/image2.jpg'],
      });
    });

    test('Deve retornar 404 quando o produto não for encontrado', async () => {
      Product.findOne.mockResolvedValue(null);

      const req = { params: { id: 999 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Produto não encontrado' });
    });

    test('Deve retornar 400 em caso de erro interno', async () => {
      Product.findOne.mockRejectedValue(new Error('Erro no banco de dados'));

      const req = { params: { id: 1 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Requisição inválida' });
    });
  });
});
