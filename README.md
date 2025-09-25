# Desafio Técnico: Conector (Custom Node) para n8n

## Introdução

Este repositório contém a minha solução para o desafio técnico de criação de um conector personalizado para a plataforma de automação n8n. O objetivo foi desenvolver um nó funcional que se integra com a API do **Random.org** para gerar números verdadeiramente aleatórios, empacotado em um ambiente de desenvolvimento robusto e fácil de replicar com Docker.

---

## Checklist de Requisitos Atendidos

Para facilitar a avaliação, abaixo está um checklist que resume como os requisitos funcionais e não funcionais do desafio foram implementados neste projeto.

-   **[x] Nome do Conector e Operação:** O conector se chama `Random` e possui uma única operação: `True Random Number Generator`.
-   **[x] Inputs "Min" e "Max":** A operação possui dois campos numéricos obrigatórios, `Min` e `Max`, com descrições amigáveis.
-   **[x] Integração com a API Random.org:** O método `execute` do nó utiliza obrigatoriamente o endpoint GET especificado para buscar os números aleatórios.
-   **[x] Ícone SVG para o Nó:** Um ícone SVG customizado foi criado e associado ao nó, aparecendo na interface do n8n.
-   **[x] Infraestrutura com Docker e PostgreSQL:** O ambiente completo é orquestrado via `docker-compose`, utilizando uma imagem oficial do n8n e um banco de dados PostgreSQL para persistência de dados.
-   **[x] Qualidade e Organização do Código:** O projeto foi estruturado de forma clara, separando a infraestrutura (`n8n-infra`) do código-fonte do conector (`n8n-nodes-random`), seguindo as melhores práticas da documentação do n8n.
-   **[x] Documentação (README.md):** Este `README.md` foi detalhadamente elaborado para prover todas as instruções necessárias para instalação, configuração e execução do projeto.

---

## Demonstração

Capturas de tela estão disponíveis na pasta **`/imagens`**.


---

## Pré-requisitos

-   **[Docker](https://www.docker.com/get-started/)** e **[Docker Compose](https://docs.docker.com/compose/install/)**
-   **[Node.js](https://nodejs.org/) v22 (LTS)**
-   **[Git](https://git-scm.com/downloads/)**

---

## Como Instalar e Executar

Siga os passos abaixo para configurar e rodar o ambiente n8n com o conector customizado.

### 1. Clonar o Repositório
```bash
git clone https://github.com/Matheus-Rossi13/matheus_rossi_n8n.git
cd https://github.com/Matheus-Rossi13/matheus_rossi_n8n.git
```

### 2. Compilar o Conector
O código-fonte precisa ser compilado de TypeScript para JavaScript.
```bash
# Navegue até a pasta do código-fonte
cd n8n-nodes-random

# Instale as dependências
npm install

# Compile o código
npm run build
```
Uma pasta `dist` será gerada com os arquivos compilados.

### 3. Configurar o Ambiente Docker

Abra o arquivo `n8n-infra/docker-compose.yml`. É **essencial** garantir que o caminho do volume mapeado esteja correto para o seu computador.

Localize a seção `volumes` e edite a linha para que aponte para o **caminho absoluto** de onde você clonou este repositório.

```yaml
# Exemplo de configuração no arquivo n8n-infra/docker-compose.yml
    volumes:
      # MUDE A LINHA ABAIXO PARA O SEU CAMINHO ABSOLUTO
      - /caminho/completo/no/seu/computador/n8n-nodes-random:/home/node/.n8n/custom/n8n-nodes-random
```

### 4. Iniciar o n8n
Com o `docker-compose.yml` configurado, inicie o ambiente.
```bash
# Navegue até a pasta de infraestrutura
cd ../n8n-infra

# Suba os contêineres
docker-compose up -d
```
- A interface do n8n estará disponível em: **`http://localhost:5679`**
- O conector "Random" será carregado automaticamente.

---

## Workflow de Exemplo

Para um teste rápido, o JSON abaixo pode ser copiado e colado (Ctrl+V) diretamente na tela de um novo workflow no n8n.

<details>
<summary>Clique para expandir e ver o código do workflow</summary>

```json
{
  "name": "Teste do Nó Random",
  "nodes": [
    {
      "parameters": {},
      "id": "5a2781a7-3b95-467b-a178-013346b3f7f2",
      "name": "Manual",
      "type": "n8n-nodes-base.manualTrigger",
      "typeVersion": 1,
      "position": [
        820,
        300
      ]
    },
    {
      "parameters": {
        "min": 1,
        "max": 100
      },
      "id": "d04495c6-764f-4d2c-af84-e408018e69e4",
      "name": "Random",
      "type": "n8n-nodes-random.random",
      "typeVersion": 1,
      "position": [
        1040,
        300
      ]
    }
  ],
  "connections": {
    "Manual": {
      "main": [
        [
          {
            "node": "Random",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {}, "staticData": null, "pinData": {}, "versionId": "b1b7f04c-d9c0-431f-b51f-5d290238318e", "meta": {}
}
```
</details>

---

Obrigado pela oportunidade.
