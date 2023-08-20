

function playHandler() {
    const level = document.querySelector('input[name="nivoRadio"]:checked').value;
    const size = document.querySelector('input[name="velicinaRadio"]:checked').value;
    const setts = {
        level: level,
        size: size,
    };
    console.log(setts);

    const queryParams = new URLSearchParams(setts);
    const queryString = queryParams.toString();
    console.log(queryString);

    const url = "zmijica_igra.html?" + queryString;
    console.log(url);

    window.location.href = url;
}

function resultsHandler() {
    localStorage.setItem('last', undefined);
    window.location.href = "zmijica_rezultati.html";
}

function menuHandler() {
    window.location.href = "zmijica_uputstvo.html";
}

