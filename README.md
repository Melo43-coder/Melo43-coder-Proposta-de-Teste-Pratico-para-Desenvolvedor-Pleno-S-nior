Serviço de Gerenciamento de Clientes:
API para gerenciamento de clientes construída com Node.js, TypeScript e MongoDB, seguindo princípios de Clean Architecture e SOLID.

*Como executar a aplicação com Docker*
Pré-requisitos:

Docker
Docker Compose


*Passos para execução*

1_Clone o repositório:
git clone https://github.com/seu-usuario/customer-service.git
cd customer-service

2_Inicie os serviços com Docker Compose:
docker-compose up -d

Este comando iniciará:
A aplicação Node.js (porta 3000)
MongoDB (porta 27017)
Redis (porta 6379)
Kafka (porta 9092)
Zookeeper (porta 2181)

3_Verifique se os serviços estão rodando:
docker-compose ps

4_Para verificar o status da aplicação:
curl http://localhost:3000/health

5_Para parar os serviços:
docker-compose down



*Endpoints disponíveis*
Clientes
Método    	Endpoint	      Descrição	Payload de Exemplo	    Resposta de Exemplo
GET	      /api/customers      	Lista todos os clientes	    -	{"success":true,"data":[{"id":"123","name":"João Silva","email":"joao@example.com","phone":"1234567890"}]}
GET    	/api/customers/:id	    Obtém detalhes de um cliente	-	{"success":true,"data":{"id":"123","name":"João Silva","email":"joao@example.com","phone":"1234567890"}}
POST	    /api/customers	          Cria um novo cliente	    {"name":"João Silva","email":"joao@example.com","phone":"1234567890"}	{"success":true,"data":{"id":"123","name":"João Silva","email":"joao@example.com","phone":"1234567890"},"message":"Cliente criado com sucesso"}

PUT	      /api/customers/:id	A      tualiza um cliente	      {"name":"João Silva Atualizado"}	    {"success":true,"data":{"id":"123","name":"João Silva Atualizado","email":"joao@example.com","phone":"1234567890"},"message":"Cliente atualizado com sucesso"}
DELETE	      /api/customers/:id	    Remove um cliente	-


*Monitoramento*
Método	Endpoint	      Descrição	Resposta de Exemplo
GET	    /health	        Verifica o status da aplicação	{"status":"ok","time":"2023-01-01T00:00:00.000Z"}
GET	    /test-mongodb	  Testa a conexão com o MongoDB	{"status":"success","message":"Teste de MongoDB concluído com sucesso","testCustomer":{...},"customerCount":5}


*Passos para execução*

Clone o repositório:
git clone https://github.com/seu-usuario/customer-service.git
cd customer-service

Instale as dependências:
npm install

Execute em modo de desenvolvimento (com hot reload):
npm run dev

Ou compile e execute em modo de produção:
npm run build
npm start



*Como executar os testes*

Testes Unitários
Execute todos os testes:
npm test
