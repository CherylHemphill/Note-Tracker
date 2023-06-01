const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 4 routes: GET/notes; Get *; Get/api/notes ; POST/api/notes

// GET/notes
app.get('notes', (req, res) => {
    res.sendFile(__dirname, '/public/notes.html');
});

// GET *
app.get('*', (req, res)=>{
    res.sendFile(__dirname, '/public/index.html')
});

// API Routes
// GET API Notes
app.get('/api/notes', (req, res) => {
    const note = JSON.parse(fs.readFile('db.json', 'utf8', (err, note) => {
        if (err) {
            console.error(err);
        else {
            res.json(note);
        }
        }
    }))
});

// POST API Notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();

    JSON.parse(fs.readFile('db.json', 'utf-8'));
    note.push(newNote);

    fs.writeFile('db.json', JSON.stringify(note));
    res.json(newNote);
});

app.listen(PORT, function(){
console.log(`listening on port: ${PORT}`)
});
