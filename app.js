const express = require('express');
const path = require('path');
const geoip = require('geoip-lite');
const app = express()
const port = 3000

// supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Fail early if environment variables are missing
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or API Key in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

app.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const { data, error } = await supabase
      .from('redirects')
      .select('url, name')
      .eq('code', code)
      .single();

    if (error || !data) {
      return res.status(404).send(geoip.lookup(req.ip));
    }

    const url = data.url.startsWith('http') ? data.url : `https://${data.url}`;
    const title = data.name || url;

    res.send(`<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:url" content="${url}" />
    <meta http-equiv="refresh" content="0;url=${url}" />
</head>
<body>
    <script>window.location.href = "${url}"</script>
</body>
</html>`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.redirect('/login.html');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.static(path.join(__dirname, 'public')))

module.exports = app;