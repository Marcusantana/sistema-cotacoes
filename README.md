## 🚧 Branch de Desenvolvimento (`dev`)

> Esta branch contém o código em desenvolvimento contínuo para o sistema de cotação de moedas. Todas as novas funcionalidades, ajustes e correções são feitas aqui antes de serem integradas à `main`.

---

## 📦 Sobre o Projeto

Esta aplicação permite visualizar as **cotações de moedas (BRL, EUR, JPY) em relação ao dólar (USD)**, com suporte a:

- Filtro de **datas** (intervalo de até 5 dias úteis).
- Seleção de **moedas específicas**.
- Visualização dos dados em **gráficos (Highcharts)**.
- Consulta à **API externa (VATCOMPY)** e persistência em banco.
- API para leitura de dados **já salvos no banco**.

---

## 🚀 Tecnologias Principais

* **Back-end**: Django (Python)
* **API de Cotações**: Integração com VATCOMPY usando `requests`
* **Banco de Dados**: SQLite (desenvolvimento), com suporte a MySQL
* **Front-end**: HTML5 + CSS3 + JavaScript
* **Gráficos**: Highcharts.js
* **Testes Automatizados**: pytest + pytest-django
* **Controle de Versão**: Git + GitHub (com uso de branches `main`, `dev`, `feat/...`)

---

## 📌 Endpoints da API

| Endpoint                      | Método | Descrição                                         |
|------------------------------|--------|---------------------------------------------------|
| `/api/cotacoes/`             | GET    | Busca cotações via API externa e persiste no DB   |
| `/api/cotacoes/salvas/`      | GET    | Busca cotações já salvas no banco de dados        |

**Parâmetros esperados:**

- `data_inicial`: `YYYY-MM-DD`
- `data_final`: `YYYY-MM-DD`
- `moedas`: Ex: `BRL,EUR,JPY`

---

