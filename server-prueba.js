//Express
const express = require('express');
const app = express();

//Para leer ficheros HTML
const fs = require('fs');
app.use(express.static('public'));

//Para leer ficheros JSON
app.use(express.json());

//Puerto
const port = 3002;

//GET's 
app.get('/', (req, res) => {
  var contenido = fs.readFileSync('./public/index.html', 'utf8');
  res.set('Content-Type', 'text/html');
  res.send(contenido);
});
app.get('/centros', (req, res) => {
  var contenido = fs.readFileSync('./public/listaCentros.html', 'utf8');
  res.set('Content-Type', 'text/html');
  res.send(contenido);
});
app.get('/alumnos', (req, res) => {
  var contenido = fs.readFileSync('./public/listaAlumnos.html', 'utf8');
  res.set('Content-Type', 'text/html');
  res.send(contenido);
});
app.get('/aprobados', (req, res) => {
  var contenido = fs.readFileSync('./public/alumnosAprobados.html', 'utf8');
  res.set('Content-Type', 'text/html');
  res.send(contenido);
});

//Main
app.listen(port, () => {
  console.log('Aplicación escuchando en puerto ' + port);
});