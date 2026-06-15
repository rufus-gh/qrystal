const express = require('express');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const redirects = {
    "abc" : "google.com",
    "123" : "apple.com",
    "amzn" : "amazon.com"
};

const keys = Object.keys(redirects);
const values = Object.values(redirects);

for (let i = 0; i < keys.length; i++) {
    app.get(`/${keys[i]}`, (req, res) => {
    res.redirect(`https://${values[i]}`)
    })
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})