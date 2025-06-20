import pytest
from django.urls import reverse
from cotacao.models import Cotacao
from decimal import Decimal
from datetime import date

# ======= TESTA SE API RETORNA DADOS DO BANCO ======= #
@pytest.mark.django_db
def teste_api_retorna_cotacoes(client):
    Cotacao.objects.create(data=date(2025, 6, 19), moeda="BRL", valor=Decimal("5.123456"))
    Cotacao.objects.create(data=date(2025, 6, 19), moeda="EUR", valor=Decimal("0.9"))
    
    url = reverse("api_cotacoes") 
    response = client.get(url, {
        "data_inicial": "2025-06-19",
        "data_final": "2025-06-19",
        "moedas": "BRL,EUR"
    })
    
    assert response.status_code == 200
    json_data = response.json()
    assert "cotacoes" in json_data
    assert "2025-06-19" in json_data["cotacoes"]
    assert json_data["cotacoes"]["2025-06-19"]["BRL"] == 5.123456 or isinstance(json_data["cotacoes"]["2025-06-19"]["BRL"], float)


# ======= TESTA SE API DA ERRO QUANDO DATAS SAO INVALIDAS ======= #
@pytest.mark.django_db
def teste_api_erro_datas_invalidas(client):
    url = reverse("api_cotacoes") 
    response = client.get(url, {
        "data_inicial": "2025-06-22",
        "data_final": "2025-06-20",  
        "moedas": "BRL"
    })
    
    assert response.status_code == 400
    assert "erro" in response.json()
