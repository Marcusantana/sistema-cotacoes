import requests
from .models import Cotacao
from decimal import Decimal

# ======= FUNCAO DE BUSCA NO BANCO DE DADOS ======== #
def buscar_cotacoes(data):
    cotacoes_banco = Cotacao.objects.filter(data=data)
    if cotacoes_banco.exists():
        return {c.moeda: float(c.valor) for c in cotacoes_banco}
    
    try:
        resposta = requests.get(
            f"https://api.vatcomply.com/rates?base=USD&date={data}",
            timeout=10
        )
        dados = resposta.json()
        
        for moeda in ['BRL', 'EUR', 'JPY']:
            valor = dados['rates'].get(moeda)
            if valor:
                Cotacao.objects.update_or_create(
                    data=data,
                    moeda=moeda,
                    defaults={'valor': Decimal(str(valor))}
                )
        
        return {
            'BRL': float(dados['rates'].get('BRL', 0)),
            'EUR': float(dados['rates'].get('EUR', 0)),
            'JPY': float(dados['rates'].get('JPY', 0))
        }
        
        
    #--- TRATAMENTO DE ERRO ---#
    except Exception:
        return {'BRL': None, 'EUR': None, 'JPY': None}