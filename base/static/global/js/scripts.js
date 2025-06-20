/* ====== ENVIO DO FORMULÁRIO====== */
document.getElementById("formulario_cotacao").addEventListener("submit", async function (e) {e.preventDefault();

    const botao = document.getElementById("botao_enviar");
    const mensagemErro = document.getElementById("mensagem_erro");
    botao.disabled = true;
    botao.textContent = "Carregando...";
    mensagemErro.style.display = "none";

    try {
        const dataInicio = document.getElementById("data_inicial").value;
        const dataFim = document.getElementById("data_final").value;
        const moedasCheckboxes = document.querySelectorAll(".moedas_container input[type=checkbox]:checked");
        const moedas = Array.from(moedasCheckboxes).map(cb => cb.value);

        if (!dataInicio || !dataFim) throw new Error("Preencha as duas datas");
        if (moedas.length === 0) throw new Error("Selecione pelo menos uma moeda");

        const diasUteis = contarDiasUteis(dataInicio, dataFim);
        if (diasUteis > 5) throw new Error("Máximo de 5 dias úteis permitido");

        const apenasBanco = document.getElementById("apenas_banco").checked;
        const url = apenasBanco
        ? `/api/cotacoes/salvas/?data_inicial=${dataInicio}&data_final=${dataFim}&moedas=${moedas.join(",")}`
        : `/api/cotacoes/?data_inicial=${dataInicio}&data_final=${dataFim}&moedas=${moedas.join(",")}`;
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (!resposta.ok) throw new Error(dados.erro || "Erro ao buscar dados");
        if (apenasBanco && (!dados.cotacoes || Object.keys(dados.cotacoes).length === 0)) {
        throw new Error("Nenhuma cotação encontrada no banco para o período/moedas selecionados.");
        }

        criarGrafico(dados.cotacoes, moedas);

    } 

    catch (erro) {
        mensagemErro.textContent = erro.message;
        mensagemErro.style.display = "block";

    } 

    finally {
        botao.disabled = false;
        botao.textContent = "Buscar Cotações";
    }
});

/* ====== FUNCAO PARA CRIAR O GRAFICO ====== */
function criarGrafico(cotacoes, moedas) {
    const container = document.getElementById("container_grafico");
    container.innerHTML = "";

    const cores = { BRL: "#11b4d1", EUR: "#f16513", JPY: "#17d111" };
    const nomes = { BRL: "Real", EUR: "Euro", JPY: "Iene" };

    const series = moedas.map(moeda => {
        const dadosMoeda = Object.keys(cotacoes).map(data => {
            const valor = cotacoes[data][moeda];
            return (valor === undefined || valor === null) ? null : valor;
    });

        if (!dadosMoeda.some(v => typeof v === "number")) return null;

        return {
            name: nomes[moeda],
            data: dadosMoeda,
            color: cores[moeda],
            showInLegend: true,
        };

    }).filter(Boolean); 

    Highcharts.chart("container_grafico", {
        chart: {
            type: "line",
            backgroundColor: "#141518"
        },

        title: {
            text: "Cotações em relação ao Dólar",
            style: { color: "#fff" }
        },

        xAxis: {
            categories: Object.keys(cotacoes),
            labels: { style: { color: "#fff" } },
            lineColor: '#4a4a4a',
            tickColor: '#4a4a4a'
        },

        yAxis: {
            title: { text: "Valor", style: { color: "#fff" } },
            labels: { style: { color: "#fff" } },
            gridLineColor: '#4a4a4a'
        },

        legend: { itemStyle: { color: "#fff" } },
        series: series,
        tooltip: {
            formatter: function() {
            return `<b>${this.x}</b><br/>${this.series.name}: <b>${this.y?.toFixed(4)}</b>`;
            }
        }
    });
}

/* ====== VALIDACAO DE DIAS UTEIS ====== */
function contarDiasUteis(dataInicio, dataFim) {
    let count = 0;
    let current = new Date(dataInicio);
    const fim = new Date(dataFim);

    while (current <= fim) {
        const dia = current.getDay();
        if (dia !== 0 && dia !== 6) count++;
        current.setDate(current.getDate() + 1);
    }

    return count;
}
