// var parseString = require('xml2js').parseString;

fetch('/json.json', {
    method: 'get',
    headers: {'Accept': 'application/json'}
}).then(response => {
    if (response.ok) {
        response.text().then(result => {
            document.getElementById('json').innerText = result;
        });
    } else response.text().then(text => console.log('Error:', text));
}).catch(error => console.log(error));

fetch('/xml.xml', {
    method: 'get',
    headers: {'Accept': 'application/xml'}
}).then(response => {
    if (response.ok)
        response.text().then(result => {
            document.getElementById('xml').innerText = result;
        });
    else
        response.text().then(text => console.log('Error:', text));
}).catch(error => console.log(error));