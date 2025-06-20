from django.http import JsonResponse
from django.views.decorators.http import require_GET
from datetime import datetime, timedelta
from cotacao.models import Cotacao
from .services import buscar_cotacoes
from django.shortcuts import render


#======= VIEW PARA ACESSAR O INDEX =======#
def home(request):
    return render(request, 'index.html')


#======= VIEW PARA LOGICA DE DIAS UTEIS =======#
def contar_dias_uteis(data_inicio, data_fim):
    dia_atual = data_inicio
    dias_uteis = 0
    while dia_atual <= data_fim:
        if dia_atual.weekday() < 5:
            dias_uteis += 1
        dia_atual += timedelta(days=1)
    return dias_uteis


#======= VIEW PARA A API DAS COTACOES =======#
@require_GET
def api_cotacoes(request):
    data_inicio = request.GET.get("data_inicial")
    data_fim = request.GET.get("data_final")
    moedas = request.GET.get("moedas", "")

    if not data_inicio or not data_fim or not moedas:
        return JsonResponse({"erro": "Preencha todas as datas e selecione pelo menos uma moeda"}, status=400)

    try:
        data_inicio = datetime.strptime(data_inicio, "%Y-%m-%d").date()
        data_fim = datetime.strptime(data_fim, "%Y-%m-%d").date()

        if data_inicio > data_fim:
            return JsonResponse({"erro": "A data inicial não pode ser maior que a final"}, status=400)

        dias_uteis = contar_dias_uteis(data_inicio, data_fim)
        if dias_uteis > 5:
            return JsonResponse({"erro": "Só é permitido consultar até 5 dias úteis de uma vez"}, status=400)

        lista_moedas = [m.strip().upper() for m in moedas.split(",")]

        datas = []
        dia_atual = data_inicio
        while dia_atual <= data_fim:
            if dia_atual.weekday() < 5:  # Segunda a sexta
                datas.append(dia_atual.strftime("%Y-%m-%d"))
            dia_atual += timedelta(days=1)

        resultado = {}
        for data in datas:
            cotacoes = buscar_cotacoes(data)
            resultado[data] = {moeda: cotacoes.get(moeda) for moeda in lista_moedas}

        return JsonResponse({"cotacoes": resultado})


    #--- TRATAMENTO DE ERRO ---#
    except ValueError:
        return JsonResponse({"erro": "Formato de data inválido. Use YYYY-MM-DD"}, status=400)

    except Exception as e:
        return JsonResponse({"erro": f"Ocorreu um erro: {str(e)}"}, status=500)


#======= VIEW PARA ACESSAR COTACOES SALVAS =======#
@require_GET
def api_cotacoes_salvas(request):
    data_inicio = request.GET.get("data_inicial")
    data_fim = request.GET.get("data_final")
    moedas = request.GET.get("moedas", "")

    if not data_inicio or not data_fim or not moedas:
        return JsonResponse({"erro": "Preencha todas as datas e selecione pelo menos uma moeda"}, status=400)

    try:
        data_inicio = datetime.strptime(data_inicio, "%Y-%m-%d").date()
        data_fim = datetime.strptime(data_fim, "%Y-%m-%d").date()

        if data_inicio > data_fim:
            return JsonResponse({"erro": "A data inicial não pode ser maior que a final"}, status=400)

        dias_uteis = contar_dias_uteis(data_inicio, data_fim)
        if dias_uteis > 5:
            return JsonResponse({"erro": "Só é permitido consultar até 5 dias úteis de uma vez"}, status=400)

        lista_moedas = [m.strip().upper() for m in moedas.split(",")]

        cotacoes_queryset = Cotacao.objects.filter(
            data__range=(data_inicio, data_fim),
            moeda__in=lista_moedas
        )

        resultado = {}
        for cotacao in cotacoes_queryset:
            data_str = cotacao.data.strftime("%Y-%m-%d")
            if data_str not in resultado:
                resultado[data_str] = {}
            resultado[data_str][cotacao.moeda] = float(cotacao.valor)

        return JsonResponse({"cotacoes": resultado})


    #--- TRATAMENTOS DE ERRO ---#
    except ValueError:
        return JsonResponse({"erro": "Formato de data inválido. Use YYYY-MM-DD"}, status=400)

    except Exception as e:
        return JsonResponse({"erro": f"Ocorreu um erro: {str(e)}"}, status=500)
