const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// 4 routes: GET/notes; Get *; Get/api/notes ; POST/api/notes

// GET /notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
  });
  
  

// API Routes: 

// GET API Notes
app.get('/api/notes', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes.' });
      }
  
      const notes = JSON.parse(data);
      res.json(notes);
    });
  });
  

// POST API Notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
  
    fs.readFile('db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to read notes.' });
      }
  
      const notes = JSON.parse(data);
      notes.push(newNote);
  
      fs.writeFile('db.json', JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to save note.' });
        }
        res.json(newNote);
      });
    });
  });
  
// GET *
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

  // DELETE API Notes
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }

    let notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    fs.writeFile('db.json', JSON.stringify(updatedNotes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete note.' });
      }
      res.json({ message: 'Note deleted successfully.' });
    });
  });
});


app.listen(PORT, () => {
console.log(`listening on port: ${PORT}`)
});
