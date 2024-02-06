const express = require('express');
const app = express();
var fs = require('fs');
app.use(express.static('public'));
const port = process.env.PORT || 3002;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var server = require('http').createServer(app);

//Bibliotecas necesarias para trabajar con SQL en Node
const bodyParser = require('body-parser');
const mysql = require('mysql');

//Toda esta información la obtenemos del Admin de Clever Cloud
const pool = mysql.createPool({
    connectionLimit: 5,
    host: 'brbpd3hpd8f5uu22rrdc-mysql.services.clever-cloud.com',
    user: 'udooet7ck5gzb66q',
    password: 'qDEt3xxyetOtLWJOAxpm',
    database: 'brbpd3hpd8f5uu22rrdc'
});

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
app.get('/matriculados', (req, res) => {
    var contenido = fs.readFileSync('./public/listaMatriculados.html', 'utf8');
    res.set('Content-Type', 'text/html');
    res.send(contenido);
});
app.get('/modificar', (req, res) => {
    var contenido = fs.readFileSync('./public/modificar.html', 'utf8');
    res.set('Content-Type', 'text/html');
    res.send(contenido);
});

// Peticiones a la BBDD
app.get('/listaCursos', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from CURSOS', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.json(rows);
            } else {
                console.log(err)
            }
        })
    })
})
app.get('/listaCentros', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from CENTROS', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.json(rows);
            } else {
                console.log(err)
            }
        })
    })
})
app.get('/listaAlumnos', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from ALUMNOS', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.json(rows);
            } else {
                console.log(err)
            }
        })
    })
})
app.get('/listaMatriculados', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT ID_ALUMNO, ALUMNOS.NOMBRE AS NOMBRE_ALUMNO, ID_CURSO, CURSOS.NOMBRE AS NOMBRE_CURSO, APROBADO FROM ALUMNOS_CURSOS INNER JOIN ALUMNOS ON ALUMNOS_CURSOS.ID_ALUMNO = ALUMNOS.ID INNER JOIN CURSOS ON ALUMNOS_CURSOS.ID_CURSO = CURSOS.ID ORDER BY ID_ALUMNO', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.json(rows);
            } else {
                console.log(err)
            }
        })
    })
})
app.get('/estadoAlumnos', (req, res) => {
    var parametro = parseInt(req.query.parametro);
    console.log("Devuelve: " + parametro);
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        //en Postman, damos un JSON {"parametro" : "home"}
        connection.query('SELECT ID_CURSO, COUNT(*) AS TOTAL_MATRICULADOS, SUM(APROBADO = 1) AS APROBADOS, SUM(APROBADO = 0) AS SUSPENSOS FROM ALUMNOS_CURSOS WHERE ID_CURSO = "' + parametro + '" GROUP BY ID_CURSO;', (err, rows) => {
            //connection.query('SELECT * from wp_options WHERE option_name="' + parametro + '"', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.json(rows);
            } else {
                console.log("Error por aqui")
            }
        })
    })
})
app.get('/obtenerCurso', (req, res) => {
    var parametro = parseInt(req.query.parametro);
    console.log("Devuelve: " + parametro);
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log('connected as id ' + connection.threadId)
        //en Postman, damos un JSON {"parametro" : "home"}
        connection.query('SELECT * FROM CURSOS WHERE ID = "' + parametro + '"', (err, rows) => {
            //connection.query('SELECT * from wp_options WHERE option_name="' + parametro + '"', (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.json(rows);
            } else {
                console.log("Error por aqui")
            }
        })
    })
})

app.put('/modificarCurso', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { nombre, nivel, descripcion, id } = req.body
        console.log(req.body);

        connection.query('UPDATE CURSOS SET nombre = ?, nivel = ?, descripcion = ? WHERE id = ?', [nombre, nivel, descripcion, id], (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(`Modificado`);
            } else {
                console.log(err);
            }
        })
    })
});

app.delete('/eliminar/:idAlumno&:idCurso', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('DELETE FROM ALUMNOS_CURSOS WHERE ID_ALUMNO = ? AND ID_CURSO = ?', [req.params.idAlumno, req.params.idCurso], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.send(`Eliminado`)
            } else {
                console.log(err)
            }
        })
    })
});

// Obtener todos los datos de una tabla con un POST (con parametros)
app.post('/insertar', (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    const params = req.body;
    console.log("Devuelve: " + params);
    pool.getConnection((err, connection) => {
        connection.query("INSERT INTO producto SET ?", params, (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.json(rows);
            } else {
                console.log("Error por aqui")
            }
        })
    })
})

app.put('/modificar', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { nombre, precio, descripcion, id } = req.body

        connection.query('UPDATE producto SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?', [nombre, precio, descripcion, id], (err, rows) => {
            connection.release() // return the connection to pool

            if (!err) {
                res.send(`Beer with the name: ${nombre} has been added.`);
            } else {
                console.log(err);
            }

        })

        console.log(req.body)
    })
});


server.listen(port, () => {
    console.log('Servidor ejecutándose en el puerto ' + port);
});