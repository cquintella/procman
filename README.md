# Manual

## Apresentação do programa

## Diretórios

./dados: arquivos de dados
./config: Arquivos de configuração
src/: Diretório principal onde todo o código fonte reside.

Seguimos o pradrào de diretórios da arquitetura limpa
> Separação de camadas visa nos poupar de problemas futuros com a manutenção do software.

![cleanarch](https://zup.com.br/wp-content/uploads/2021/10/Clean-Architecture-4-1.png)

**domain**: A camada de domínio contendo a lógica de negócio.
**infra**:  camada de infraestrutura, contendo as tecnologias utilizadas.

### Infra

**adapters**: (ou Interface Adapters) são os serviços intermediários na comunicação com o mundo exterior. Os Adapters têm como principal atribuição a conversão de dados, tratamento de erros e validação de regras sintáticas (por exemplo, formato de data invalido ou envio de texto em campo do tipo numérico).

controllers: Lida com as requisições HTTP e direciona para os casos de uso apropriados.

routes: Define as rotas e associa os controladores às requisições.

entities: Contém Entities que representam os nossos objetos de negócios.

errors: Define os tipos de erros específicos para o domínio.

gateways: Interfaces para fontes de dados externas (bancos de dados, APIs, etc.).

interfaces: Define as interfaces para a comunicação entre diferentes camadas.

middlewares: Processa requisições antes de chegarem aos controladores, garantindo autenticação, validação, etc.

repos: Implementações específicas dos repositórios para persistência de dados.

types: Define tipos e interfaces comuns usados em toda a aplicação.

**use_cases**: Códigos as funcionalidades mapeadas baseadas nas histórias de usuário, onde implementamos as regras de negócio.

DTO = Data Transfer Object

## instalação

### Criar certificados

openssl genpkey -algorithm RSA -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -in csr.pem -signkey key.pem -out cert.pem
copiar key.pem e cert.pem para data/cert

npm install express body-parser
npm install typescript @types/node @types/express ts-node-dev --save-dev
npm install bcryptjs
npm install express-validator
npm i --save-dev @types/jsonwebtoken
npm install uuid
npm install --save-dev @types/uuid
npm install --save-dev @types/bcryptjs

npm install purify-ts
npm install dotenv @types/dotenv --save
npm install winston

npm start