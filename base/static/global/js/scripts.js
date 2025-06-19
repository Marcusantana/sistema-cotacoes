/* ========= ARMAZENAMENTO TEMPORARIO DAS COTACOES (CACHE) ========= */
const cacheCotacoes = {};

/* ========= ENVIO DE DADOS DO FORMULARIO ========= */
document.getElementById("formulario_cotacao").addEventListener("submit", async function (e) {
    e.preventDefault();

    const botaoEnviar = document.getElementById("botao_enviar");
    const textoOriginalBotao = botaoEnviar.textContent;
    const mensagemErro = document.getElementById("mensagem_erro");

    botaoEnviar.disabled = true;
    botaoEnviar.innerHTML = '<span class="girador"></span> Buscando dados...';
    mensagemErro.style.display = "none";

    try {
        const dataInicial = document.getElementById("data_inicial").value;
        const dataFinal = document.getElementById("data_final").value;
        const moedasSelecionadas = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(checkbox => checkbox.value);

        if (!dataInicial || !dataFinal) {
            throw new Error("Por favor, preencha ambas as datas.");
        }

        if (moedasSelecionadas.length === 0) {
            throw new Error("Selecione pelo menos uma moeda.");
        }

        const objetoDataInicial = new Date(dataInicial + 'T00:00:00');
        const objetoDataFinal = new Date(dataFinal + 'T00:00:00');

        if (objetoDataInicial > objetoDataFinal) {
            throw new Error("A data inicial não pode ser maior que a data final.");
        }

        const datasUteis = obterDatasUteis(dataInicial, dataFinal);

        if (datasUteis.length === 0) {
            throw new Error("Nenhum dia útil encontrado no intervalo selecionado.");
        }

        const MAX_DIAS_UTEIS = 5;
        if (datasUteis.length > MAX_DIAS_UTEIS) {
            throw new Error(`O período máximo permitido é de ${MAX_DIAS_UTEIS} dias úteis. Você selecionou ${datasUteis.length} dias úteis.`);
        }

        const dadosCotacoes = {};
        let houveErroBusca = false;

        for (const dataAtual of datasUteis) {
            try {
                if (cacheCotacoes[dataAtual]) {
                    dadosCotacoes[dataAtual] = cacheCotacoes[dataAtual];
                    continue;
                }

                const urlApi = `https://api.vatcomply.com/rates?base=USD&date=${dataAtual}`;
                const resposta = await fetch(urlApi);

                if (!resposta.ok) {
                    throw new Error(`Erro na API para a data ${dataAtual}: ${resposta.status}`);
                }

                const dadosDaApi = await resposta.json();

                if (!dadosDaApi.rates) {
                    throw new Error(`Dados incompletos da API para a data ${dataAtual}`);
                }

                dadosCotacoes[dataAtual] = {};
                moedasSelecionadas.forEach(moeda => {
                    dadosCotacoes[dataAtual][moeda] = dadosDaApi.rates[moeda] ?? null;
                });

                cacheCotacoes[dataAtual] = dadosCotacoes[dataAtual];

            } catch (erroBusca) {
                console.error(`Erro ao buscar cotações para ${dataAtual}:`, erroBusca);
                houveErroBusca = true;
                dadosCotacoes[dataAtual] = {};
                moedasSelecionadas.forEach(moeda => {
                    dadosCotacoes[dataAtual][moeda] = null;
                });
            }
        }

        if (houveErroBusca) {
            mensagemErro.textContent = "Algumas cotações não puderam ser carregadas. Busque novamente para recarregar";
            mensagemErro.style.display = "block";
        }

        // Só renderiza se tiver algum dado
        if (Object.keys(dadosCotacoes).length > 0) {
            renderizarGrafico(datasUteis, dadosCotacoes, moedasSelecionadas);
        } else {
            mensagemErro.textContent = "Não foi possível carregar os dados. Tente novamente.";
            mensagemErro.style.display = "block";
        }

    } catch (erro) {
        console.error("Erro geral:", erro);
        mensagemErro.textContent = erro.message;
        mensagemErro.style.display = "block";
    } finally {
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = textoOriginalBotao;
    }
});

/* ========= FUNCAO PARA GERAR O GRAFICO COM HIGHCHARTS ========= */
function renderizarGrafico(datas, cotacoes, moedas) {
    const elementoContainer = document.getElementById('container_grafico');
    elementoContainer.innerHTML = '';

    const mapeamentoCores = {
        BRL: '#11b4d1',
        EUR: '#f16513',
        JPY: '#17d111'
    };

    const seriesGrafico = moedas.map(moeda => ({
        name: moeda,
        data: datas.map(dataUnica => cotacoes[dataUnica]?.[moeda] ?? null),
        color: mapeamentoCores[moeda],
        lineWidth: 3,
        marker: {
            enabled: true,
            radius: 5,
            symbol: 'circle',
            lineWidth: 2,
            lineColor: '#fff'
        },
        connectNulls: true
    }));

    Highcharts.chart('container_grafico', {
        chart: {
            type: 'line',
            backgroundColor: '#141518',
            animation: {
                duration: 500
            },
            styledMode: false
        },
        title: {
            text: 'Cotações das moedas em relação ao dólar (USD)',
            style: {
                color: '#fff',
                fontSize: '18px',
                fontWeight: '500'
            },
            margin: 30
        },
        xAxis: {
            categories: datas,
            title: {
                text: 'Data',
                style: {
                    color: '#fff',
                    fontWeight: '500'
                }
            },
            labels: {
                style: {
                    color: '#fff',
                    fontSize: '12px'
                },
                rotation: -45
            },
            lineColor: '#9c9c9c',
            tickColor: '#9c9c9c',
            gridLineColor: '#535353'
        },
        yAxis: {
            title: {
                text: 'Valor da Moeda em relação ao dólar (USD)',
                style: {
                    color: '#fff',
                    fontWeight: '500'
                }
            },
            labels: {
                style: {
                    color: '#fff',
                    fontSize: '12px'
                }
            },
            gridLineColor: '#3e4e6d',
            lineColor: '#9c9c9c'
        },
        legend: {
            itemStyle: {
                color: '#fff',
                fontSize: '13px',
                fontWeight: '400'
            },
            itemHoverStyle: {
                color: '#ffd100'
            },
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            margin: 20
        },
        plotOptions: {
            series: {
                animation: {
                    defer: 100
                },
                label: {
                    connectorAllowed: false
                },
                pointStart: 0
            }
        },
        tooltip: {
            backgroundColor: '#181a20',
            borderColor: '#9c9c9c',
            borderRadius: 8,
            style: {
                color: '#fff',
                fontSize: '14px'
            },
            shared: true,
            crosshairs: true
        },
        credits: {
            enabled: false
        },
        series: seriesGrafico,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 600
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    });
}

/* ========= FUNCAO PARA OBTER AS DATAS UTEIS ========= */
function obterDatasUteis(inicio, fim) {
    const dataDeInicio = new Date(inicio + 'T00:00:00');
    const dataDeFim = new Date(fim + 'T00:00:00');
    const arrayDatas = [];
    const dataAtualIteracao = new Date(dataDeInicio);

    while (dataAtualIteracao <= dataDeFim) {
        const diaDaSemana = dataAtualIteracao.getDay();
        if (diaDaSemana !== 0 && diaDaSemana !== 6) {
            arrayDatas.push(dataAtualIteracao.toISOString().split('T')[0]);
        }
        dataAtualIteracao.setDate(dataAtualIteracao.getDate() + 1);
    }

    return arrayDatas;
}