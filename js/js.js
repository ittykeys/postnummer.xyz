const lookupBtn = document.getElementById('lookupBtn');
const inputerror = document.getElementById('inputerror');
let zip;
function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
function doLookup(zip) {
    const output = document.getElementById('output');
    const apiUrl = `https://<!--#echo var="API_URL" -->/autozip?query=${encodeURIComponent(zip)}`;
    output.textContent = ltext;
    requestAnimationFrame(() => {
        setTimeout(() => {
            fetch(apiUrl)
                .then(res => {
                    if (!res.ok) throw new Error(nerr);
                    return res.json();
                })
                .then(data => {
                    if (!data.results || data.results.length === 0) {
                        output.textContent = nores;
                        return;
                    }
                    const result = data.results[0];
                    var zipresult = result.zip.slice(0, -2) + ' ' + result.zip.slice(-2);
                    output.innerHTML = `
                        <h3>${zipresult} = ${result.city}</h3>
                        <p><strong>${county}: </strong> ${result.county} (${result.county_code})</p>
                        <p><strong>${state}: </strong> ${result.state} (${result.state_code})</p>
                        <p><strong>${lat}: </strong> Ca. ${result.latitude}</p>
                        <p><strong>${long}: </strong> Ca. ${result.longitude}</p>
                        <p>^ <a id='maplink' target='_blank' href='https://www.openstreetmap.org/search?lat=${result.latitude}&lon=${result.longitude}'>OpenStreetMap</a></p>
                    `;
                    zipInput.value = '';
                })
                .catch(err => {
                    output.textContent = `${err}: ${err.message}`;
                });
        },200);
    });
}
function validateAndLookup() {
    const zip = zipInput.value.replace(/\s+/g, '');
    if (!zip || !/^\d{5}$/.test(zip)) {
        zipInput.style.boxShadow = 'inset 0 0 0 0.15em red';
        inputerror.innerHTML = nuerr;
        setTimeout(() => {
            zipInput.style.boxShadow = 'none';
        }, 500);
        zipInput.addEventListener('input', () => {
            inputerror.innerHTML = '';
        }, { once: true });
        return false;
    }
    doLookup(zip);
    if (isMobile()) {
        zipInput.blur();
    }
    return true;
}
lookupBtn.addEventListener('click', validateAndLookup);
zipInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        validateAndLookup();
    }
});
window.addEventListener('load', () => {
    zipInput.focus();
    zipInput.value = '';
});