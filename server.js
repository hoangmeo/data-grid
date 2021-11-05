var express = require('express');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/callback-response', function (req, res) {
    console.log(req);
    res.send('hello world');
});

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`);
});
