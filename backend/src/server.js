import express from 'express';

const app = express();
const port = 3000;

// hello world
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});