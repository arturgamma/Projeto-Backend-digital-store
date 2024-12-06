# Back-end Digital Store

Este é o projeto de um back-end para uma loja virtual, desenvolvido com Node.js, Express e MySQL. Ele oferece APIs para gerenciar categorias de produtos, usuários e outras funcionalidades essenciais para a administração da loja.

## Tecnologias utilizadas

  - **Node.js**: Plataforma de desenvolvimento back-end.
  - **Express**: Framework para criação de APIs.
  - **MySQL**: Banco de dados para persistência.
  - **Sequelize**: ORM (Object Relational Mapping) para interagir com o banco de dados.
  - **Jest**: Ferramenta para testes automatizados.
  - **bcrypt.js**: Biblioteca para hash de senhas.


## Instalação

1. Clone o repositório:

   bash
   cd nome-do-repositorio
   git clone https://github.com/arturgamma/Projeto-Backend-digital-store/new/master?filename=README.md

2.Instale as dependências:

  npm i
  
3.Configure o banco de dados no arquivo src/config/db.js

4.Execute as migrações para criar as tabelas:
  node run-migrations.js

5.Rode o seguinte script no banco de dados para povoar as tabelas:

 INSERT INTO digital_store.categories (id, name, slug, use_in_menu, created_at, updated_at) VALUES
  (1, 'Roupas', 'roupas', 1, NOW(), NOW()),
  (2, 'Calçados', 'calcados', 1, NOW(), NOW()),
  (3, 'Acessórios', 'acessorios', 1, NOW(), NOW());

INSERT INTO digital_store.products 
  (id, enabled, name, slug, use_in_menu, stock, description, price, price_with_discount, created_at, updated_at) VALUES
  (1, 1, 'Camiseta Básica', 'camiseta-basica', 1, 50, 'Camiseta 100% algodão de alta qualidade', 29.99, 24.99, NOW(), NOW()),
  (2, 1, 'Tênis Esportivo', 'tenis-esportivo', 1, 20, 'Tênis confortável para atividades físicas', 149.99, 129.99, NOW(), NOW()),
  (3, 1, 'Relógio de Pulso', 'relogio-pulso', 1, 10, 'Relógio elegante com design moderno', 199.99, 179.99, NOW(), NOW());


INSERT INTO digital_store.productimages 
  (id, product_id, enabled, path, created_at, updated_at) VALUES
  (1, 1, 1, 'images/products/camiseta1.jpg', NOW(), NOW()),
  (2, 2, 1, 'images/products/tenis1.jpg', NOW(), NOW()),
  (3, 3, 1, 'images/products/relogio1.jpg', NOW(), NOW());


INSERT INTO digital_store.productoptions 
VALUES
  (1, 1, 'Tamanho', 'square', 0, 'text', 'P,M,G,GG', NOW(), NOW()),
  (2, 2, 'Cores', 'circle', 0, 'color', '#FF0000,#00FF00,#0000FF', NOW(), NOW()),
  (3, 3, 'Material', 'square', 0, 'text', 'Aço Inox,Couro,Plástico', NOW(), NOW());

INSERT INTO digital_store.productcategories
(product_id, category_id, created_at, updated_at) VALUES
  (1, 1, NOW(), NOW()), -- Camiseta Básica na categoria Roupas
  (2, 2, NOW(), NOW()), -- Tênis Esportivo na categoria Calçados
  (3, 3, NOW(), NOW()); -- Relógio de Pulso na categoria Acessórios

INSERT INTO digital_store.users (id, firstname, surname, email, password, created_at, updated_at) VALUES
  (1, 'John', 'Doe', 'john.doe@example.com', '$2b$10$UqT6e8QaRXcsJ4EsGhtDIeJO6/ZdmC8SYwdCUF3H0fUvChdjBOWS6', NOW(), NOW()),
  (2, 'Jane', 'Smith', 'jane.smith@example.com', '$2b$10$JHQU9ZIs.T/XPx.E3ZjAPu4bV7L4hpFEPoCE4Tk1AdGFl9YtIfndO', NOW(), NOW()),
  (3, 'Alice', 'Brown', 'alice.brown@example.com', '$2b$10$Me6IB9x7Ru1Swrl7Qb7oFuGy6OT4gXKquHlIC0oeFkchA2lLBM4hK', NOW(), NOW()),
  (4, 'Bob', 'Johnson', 'bob.johnson@example.com', '$2b$10$OflMcu5RgHY31z7AdgM6D.kN4bEsPMrbTyLL/dt9Tsh7K.dRDf12y', NOW(), NOW()),
  (5, 'Eve', 'Williams', 'eve.williams@example.com', '$2b$10$OGHOBIF1vRJ99NQVG.PKu6RFKfgwAf1fUwHXa4VXvAoSy5.WZkPiC', NOW(), NOW());



-----------------------------------------------------------------------------------------------------------------------------------
1.Uso
  Inicie o servidor:

  npm start

