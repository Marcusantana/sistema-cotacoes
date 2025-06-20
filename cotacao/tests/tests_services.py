import pytest
from unittest.mock import patch
from decimal import Decimal
from cotacao.services import buscar_cotacoes
from cotacao.models import Cotacao

# ======= TESTA SE RETORNA DADOS SALVOS NO BANCO ======= #
@pytest.mark.django_db
def teste_buscar_cotacoes_do_banco():
    cot = Cotacao.objects.create(data="2025-06-19", moeda="BRL", valor=Decimal("5.123456"))
    
    resultado = buscar_cotacoes("2025-06-19")
    assert resultado["BRL"] == float(cot.valor)


# ======= TESTA SE PEGA OS DADOS DA API E SALVA NO BANCO ======= #
@patch("cotacao.services.requests.get")
@pytest.mark.django_db
def teste_buscar_cotacoes_da_api(mock_get):
    mock_get.return_value.json.return_value = {
        "rates": {
            "BRL": 5.5,
            "EUR": 0.9,
            "JPY": 110.0
        }
    }

    data_teste = "2025-06-20"
    resultado = buscar_cotacoes(data_teste)
    
    assert resultado["BRL"] == 5.5
    assert resultado["EUR"] == 0.9
    assert resultado["JPY"] == 110.0
    
    cot_br = Cotacao.objects.get(data=data_teste, moeda="BRL")
    assert cot_br.valor == Decimal("5.5")


# ======= TESTA SE TRATA ERRO NA REQUISICAO DA API ======= #
@patch("cotacao.services.requests.get")
@pytest.mark.django_db
def teste_trata_erro_api(mock_get):
    mock_get.side_effect = Exception("Erro na requisição")
    
    resultado = buscar_cotacoes("2025-06-21")
    
    assert resultado == {"BRL": None, "EUR": None, "JPY": None}
