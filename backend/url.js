let url = require('url');
let adr = 'http://localhost:8080/default.htm?year=2017&month=february#hash';
let q = url.parse(adr, true);
console.log(q);
console.log(q.host);
console.log(q.pathname);
console.log(q.search);
console.log(q.hash);

let qdata = q.query;
console.log(qdata.month);