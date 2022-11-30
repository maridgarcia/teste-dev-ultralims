let span = document.createElement('span');
const resultado = document.querySelector('.resultado');
const tableDiv = document.getElementById('tabela');

let listaDeCepPesquisados = [];

const mostrarResultado = (dados) => {
    criaTabela(dados);
}

const criaTabela = (obj) => {
    const cabecalho = Object.keys(obj[0]);
    let tabela = document.createElement('table');
    let linhaCabecalho = document.createElement('tr');

    cabecalho.forEach(headerText => {
        let header = document.createElement('th');
        let textNode = document.createTextNode(headerText);
        if(headerText === "uf" || headerText === "bairro" || headerText === "localidade" ) {
            header.addEventListener('click', () => { console.log('clicou') });
        }
        header.appendChild(textNode);
        linhaCabecalho.appendChild(header);
    });

    tabela.appendChild(linhaCabecalho);

    obj.forEach(item => {
        let row = document.createElement('tr');
        Object.values(item).forEach(text => {
            let cell  = document.createElement('td');
            let textNode = document.createTextNode(text);
            cell.appendChild(textNode);
            row.appendChild(cell);
        });
        tabela.appendChild(row);
    });
    tableDiv.append(tabela);
}

const postRequest = (url, body) => {
    let request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(body));

    request.onload = () => {
        console.log(this.responseText);
    }
    mostrarResultado(body)
    return request.responseText;
}

const salvaCep = () => {
    event.preventDefault();

    const cep = document.querySelector('#cep').value;
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    span.innerText = "CEP precisa ter 8 dígitos";
    
    tableDiv.innerHTML = ' ';

    fetch(url)
        .then((res) => {
        res.json()
        .then((dados) => {
            if(!dados.erro) {
                listaDeCepPesquisados.push(dados);
            }
            let listaDeCepFiltrada = [...new Map(listaDeCepPesquisados.map((item) => [item["cep"], item])).values()];
            postRequest(url, listaDeCepFiltrada);
        });
    });
}