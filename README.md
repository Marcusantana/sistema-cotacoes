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

## 🛠 Tecnologias

- **Django 5** + Django REST (estrutura REST sem serializers)
- **HTML5**, **CSS3**, **JavaScript Vanilla**
- **Highcharts.js** (visualização gráfica)
- **Banco**: SQLite (dev), MySQL (suporte)
- **Testes**: `pytest`, `pytest-django`
- **API externa**: [VATCOMPY](https://www.vatcomply.com/documentation)

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
