## 📘 Sistema de cotação de moedas

> Este repositório contém o **back-end e front-end da plataforma de cotações de moedas**, desenvolvido em **Django**.

---

## 📌 Sobre o Projeto

Esta plataforma permite que **usuários** visualizem as **cotações de moedas (Real, Euro e Iene)** em relação ao **Dólar americano (USD)**, exibidas em **gráficos interativos**.

É possível selecionar um intervalo de até **5 dias úteis** e escolher quais moedas exibir. As cotações são obtidas via API externa e salvas localmente para acelerar futuras consultas.

---

## 🚩 Visão Geral

**Back-end** com Django para lidar com regras de negócio e chamadas à API externa ([VATCOMPY](https://www.vatcomply.com/documentation)).
**Cotações persistidas** em banco de dados, evitando requisições repetidas.
**Visualização com Highcharts**, oferecendo gráficos dinâmicos.
**Validação de datas** no front-end e no back-end (máximo 5 dias úteis, excluindo finais de semana).
**Consulta opcional ao banco de dados**, sem chamadas externas, para performance e fallback offline.

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

## 🔗 Endpoints da API

| Método | Endpoint                | Descrição                                    |
| ------ | ----------------------- | -------------------------------------------- |
| GET    | `/api/cotacoes/`        | Consulta a API externa e salva no banco.     |
| GET    | `/api/cotacoes/salvas/` | Consulta apenas as cotações salvas no banco. |

### Parâmetros obrigatórios:

* `data_inicial`: Data inicial no formato `YYYY-MM-DD`
* `data_final`: Data final no formato `YYYY-MM-DD`
* `moedas`: Lista separada por vírgulas. Ex: `BRL,EUR,JPY`

### Exemplo de requisição:

```
GET /api/cotacoes/?data_inicial=2025-06-17&data_final=2025-06-20&moedas=BRL,EUR
```

### Regras:

* Período máximo permitido: **5 dias úteis**
* As cotações são sempre baseadas no **Dólar (USD)**

---

## 🧪 Testes Automatizados

O projeto contém cobertura de testes para:

* Models (validação, string, unicidade)
* Services (validação da logica e mock da API)
* Views (validação de regras de negócio e respostas esperadas)

Execute com:

```bash
pytest
```

---

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/sistema-cotacoes.git
cd sistema-cotacoes
```

2. Crie um ambiente virtual e ative:

```bash
python -m venv venv
venv\Scripts\activate     # Windows
```

3. Instale as dependências:

```bash
pip install -r requirements.txt
```

4. Aplique as migrações:

```bash
python manage.py makemigrations
python manage.py migrate
```

5. Inicie o servidor:

```bash
python manage.py runserver
```

---

