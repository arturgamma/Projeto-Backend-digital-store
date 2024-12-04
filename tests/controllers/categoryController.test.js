const { Category } = require('../../src/models');
const categoryController = require('../../src/controllers/categoryController');

jest.mock('../../src/models', () => ({
  Category: {
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('Category Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks(); 
  });

});
