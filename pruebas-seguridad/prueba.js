const express = require("express");
const app = express();

app.get("/buscar", (req, res) => {
    const consulta = req.query.q;
    const resultado = eval(consulta);
    res.send(String(resultado));
});

app.listen(3001);
