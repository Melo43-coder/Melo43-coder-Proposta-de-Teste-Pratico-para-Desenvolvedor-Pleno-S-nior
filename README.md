Serviço de Gerenciamento de Clientes
Um serviço backend para cadastro e gerenciamento de clientes, construído com Node.js, TypeScript e MongoDB, seguindo os princípios de Clean Architecture e SOLID.
📋 Índice

Visão Geral
Tecnologias
Executando com Docker
Executando Localmente
Endpoints da API
Executando Testes
Estrutura do Projeto

🔍 Visão Geral
Este projeto implementa uma API RESTful para gerenciamento de clientes, com recursos de cache e mensageria para melhorar a performance e permitir integrações com outros sistemas.
🛠️ Tecnologias

Backend: Node.js, TypeScript, Express
Banco de Dados: MongoDB
Cache: Redis
Mensageria: Kafka
Containerização: Docker
Testes: Jest

🐳 Executando com Docker
Pré-requisitos

Docker
Docker Compose

Passos para execução

Clone o repositório:
git clone https://github.com/seu-usuario/customer-service.git
cd customer-service


Inicie os serviços com Docker Compose:
docker-compose up -d

Isso iniciará:

A aplicação Node.js (porta 3000)
MongoDB (porta 27017)
Redis (porta 6379)
Kafka (porta 9092)
Zookeeper (porta 2181)


Verifique se os serviços estão rodando:
docker-compose ps


Acesse a API em:
http://localhost:3000/health


Para parar os serviços:
docker-compose down



💻 Executando Localmente
Pré-requisitos

Node.js v14+
MongoDB
Redis (opcional, usa mock em desenvolvimento)
Kafka (opcional, usa mock em desenvolvimento)

Instalação

Clone o repositório:
git clone https://github.com/seu-usuario/customer-service.git
cd customer-service


Instale as dependências:
npm install


Configure as variáveis de ambiente:
cp .env.example .env
# Edite o arquivo .env com suas configurações


Execute em modo de desenvolvimento:
npm run dev


Ou compile e execute em modo de produção:
npm run build
npm start



📡 Endpoints da API
Clientes



Método
Endpoint
Descrição
Payload de Exemplo
Resposta de Exemplo



GET
/api/customers
Lista todos os clientes
-
{"success":true,"data":[{"id":"123","name":"João Silva","email":"joao@example.com","phone":"1234567890","createdAt":"2023-01-01T00:00:00.000Z","updatedAt":"2023-01-01T00:00:00.000Z"}]}


GET
/api/customers/:id
Obtém detalhes de um cliente
-
{"success":true,"data":{"id":"123","name":"João Silva","email":"joao@example.com","phone":"1234567890","createdAt":"2023-01-01T00:00:00.000Z","updatedAt":"2023-01-01T00:00:00.000Z"}}


POST
/api/customers
Cria um novo cliente
{"name":"João Silva","email":"joao@example.com","phone":"1234567890"}
{"success":true,"data":{"id":"123","name":"João Silva","email":"joao@example.com","phone":"1234567890","createdAt":"2023-01-01T00:00:00.000Z","updatedAt":"2023-01-01T00:00:00.000Z"},"message":"Cliente criado com sucesso"}


PUT
/api/customers/:id
Atualiza um cliente
{"name":"João Silva Atualizado"}
{"success":true,"data":{"id":"123","name":"João Silva Atualizado","email":"joao@example.com","phone":"1234567890","createdAt":"2023-01-01T00:00:00.000Z","updatedAt":"2023-01-01T00:00:00.000Z"},"message":"Cliente atualizado com sucesso"}


DELETE
/api/customers/:id
Remove um cliente
-
{"success":true,"message":"Cliente excluído com sucesso"}


Monitoramento



Método
Endpoint
Descrição
Resposta de Exemplo



GET
/health
Verifica o status da aplicação
{"status":"ok","time":"2023-01-01T00:00:00.000Z"}


GET
/test-mongodb
Testa a conexão com o MongoDB
{"status":"success","message":"Teste de MongoDB concluído com sucesso","testCustomer":{...},"customerCount":5}


Exemplos de uso com cURL

Criar um cliente:
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","phone":"1234567890"}'


Obter todos os clientes:
curl -X GET http://localhost:3000/api/customers


Obter um cliente específico:
curl -X GET http://localhost:3000/api/customers/123


Atualizar um cliente:
curl -X PUT http://localhost:3000/api/customers/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva Atualizado"}'


Excluir um cliente:
curl -X DELETE http://localhost:3000/api/customers/123



🧪 Executando Testes
Testes Unitários
Execute todos os testes:
npm test

Execute testes com cobertura:
npm run test:coverage

Execute testes de um arquivo específico:
npm test -- tests/unit/application/services/customer-service.spec.ts

Testes de Integração
npm run test:integration

Testes E2E
# Certifique-se de que os serviços estão rodando
npm run test:e2e

📁 Estrutura do Projeto
src/
├── domain/             # Regras de negócio e entidades
│   ├── entities/       # Definição de entidades
│   └── repositories/   # Interfaces de repositórios
├── application/        # Casos de uso e serviços
│   └── services/       # Serviços da aplicação
├── infrastructure/     # Implementações técnicas
│   ├── config/         # Configurações
│   ├── cache/          # Implementação de cache
│   ├── messaging/      # Implementação de mensageria
│   └── database/       # Implementação de banco de dados
├── presentation/       # Controllers e rotas da API
│   ├── controllers/    # Controladores
│   └── routes/         # Definição de rotas
└── main.ts             # Ponto de entrada da aplicação

tests/
├── unit/              # Testes unitários
├── integration/       # Testes de integração
└── e2e/               # Testes end-to-end

🐳 Detalhes do Docker Compose
O arquivo docker-compose.yml configura os seguintes serviços:

app: A aplicação Node.js

Construída a partir do Dockerfile
Exposta na porta 3000
Depende de MongoDB, Redis e Kafka


mongodb: Banco de dados MongoDB

Imagem: mongo:5
Exposto na porta 27017
Volume para persistência de dados


redis: Serviço de cache Redis

Imagem: redis:6
Exposto na porta 6379
Volume para persistência de dados


zookeeper: Necessário para o Kafka

Imagem: confluentinc/cp-zookeeper:7.0.1
Exposto na porta 2181


kafka: Serviço de mensageria

Imagem: confluentinc/cp-kafka:7.0.1
Exposto na porta 9092
Depende do Zookeeper




Desenvolvido com ❤️ como parte de um projeto de demonstração de Clean Architecture e SOLID.
