import pytest
from decimal import Decimal
from cotacao.models import Cotacao
from django.db import IntegrityError
from datetime import date

# ======= TESTA SE PODE CRIAR UMA COTACAO ======= #
@pytest.mark.django_db
def teste_criar_cotacao():
    cot = Cotacao.objects.create(
        data=date(2025, 6, 19),
        moeda="BRL",
        valor=Decimal("5.123456")
    )
    assert cot.data == date(2025, 6, 19)
    assert cot.moeda == "BRL"
    assert cot.valor == Decimal("5.123456")


# ======= TESTA SE A FORMATACAO DA STRING ======= #
def teste_str_cotacao():
    cot = Cotacao(
        data=date(2025, 6, 19),
        moeda="EUR",
        valor=Decimal("0.85")
    )
    esperado = "EUR - 2025-06-19: 0.85"
    assert str(cot) == esperado


# ======= TESTA SE NAO DA PARA CRIAR COTACAO DUPLICADA (data + moeda) ======= #
@pytest.mark.django_db
def teste_nao_criar_duplicado():
    Cotacao.objects.create(data=date(2025, 6, 19), moeda="JPY", valor=Decimal("110.123456"))
    with pytest.raises(IntegrityError):
        Cotacao.objects.create(data=date(2025, 6, 19), moeda="JPY", valor=Decimal("111.123456"))
