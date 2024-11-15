

// INSERIRE QUI IL CODICE INDICATO NELL'ESERCIZIO
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

const dataPath = path.join('backend', 'data', 'studenti.json');

function leggiJsonStudenti() {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Errore lettura file', error);
        return { studenti:[] };
    }
}

function salvaJsonStudenti(data) {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
        return true;
    } catch (error) {
        console.error('ERRORE scrittura file:', error)
        return false;
    }
}

app.get('/', (req,res) => {
    const data = leggiJsonStudenti();
    res.render('index', {studenti: data.studenti });
})

app.post('/aggiungi-studente', (req,res) => {
    const data = leggiJsonStudenti();

    let nuovoID = 1;
    let iMax = 0;
    for (let i=0; i<data.studenti.length; i++) {
        if (data.studenti[i].id > data.studenti[iMax].id) {
            iMax = i;
            nuovoID = data.studenti[iMax].id + 1;
        }
    }

    const nuovoStudente = {
        id: nuovoID,
        nome: req.body.nome,
        crediti: parseInt(req.body.crediti)
    };

    data.studenti.push(nuovoStudente);
    salvaJsonStudenti(data);

    res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
