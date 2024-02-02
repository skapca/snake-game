
import { getTopTen } from "./firebase.js";

document.addEventListener("DOMContentLoaded", async function() {
    
    const polje = document.getElementsByClassName('vas-rezultat')[0];
    polje.style.display = 'none';

    const tabela = document.getElementById('tabela');

    
    let sorted = await getTopTen();

    sorted.sort((a, b) => b[1] - a[1]);

    let table = document.createElement("table");

    for (let i = 0; i < Math.min(sorted.length, 10); i++) {
        let row = document.createElement("tr");

        let pos = document.createElement("td");
        let name = document.createElement("td");
        let val = document.createElement("td");

        pos.innerText = (i + 1).toString() + '.';
        name.innerText = sorted[i][0];
        val.innerText = sorted[i][1];

        row.appendChild(pos);
        row.appendChild(name);
        row.appendChild(val);

        table.appendChild(row);
    }

    tabela.appendChild(table);

    const last_player = localStorage.getItem('last');
    if (last_player && last_player != 'undefined') {
        polje.style.display = "";
        const last_score = document.getElementById('last-score');
        last_score.innerText = scores[last_player];
    }

});


function clearStorage() {
    localStorage.clear();
}

