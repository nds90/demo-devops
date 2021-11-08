const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');


// Blocking, Synchronoss Way

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about nds syarbaini: ${textIn}./nCreated On ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File Successfully Write');

// Non-Blocking, Asynchronoss Way

// fs.readFile('./txt/star.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//         fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//             console.log('Your File has been written');
//         })
//     });
//     });
// });
// console.log('Will Read This');

// WEB SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCards = fs.readFileSync(`${__dirname}/templates/template-cards.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const dataObj = JSON.parse(data);

const webserver = http.createServer((req, res) => {
//    console.log(req);
//    console.log(req.url);
    const { query, pathname  } = url.parse(req.url, true);

    // OVERVIEW PAGE
    if ( pathname  === '/' || pathname  === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html'});

        const cardsHtml = dataObj.map( el => replaceTemplate(tempCards, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    // PRODUCT PAGE
    }   else if ( pathname  === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API PAGE
    }   else if ( pathname  === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json'});
        res.end(data);

    // Not Found Page
    }   else {
        res.writeHead (404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
    res.end('<h1>Page Not Found!</h1>');
    }
});

webserver.listen(8000, '0.0.0.0', () => {
    console.log('Listening to request on port 8000');
});