const { Router } = require("express");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = new Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

let upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }

    cb(undefined, true);
  },
  storage: storage,
});

router.get("/", (req, res) => {
  res.render("home");
});

//
router.get("/notes", (req, res) => {
  fs.readFile("./data/notes.json", (err, notes) => {
    if (err) throw err;
    const allNotes = JSON.parse(notes);
    res.render("notes", { notes: allNotes });
  });
});

//
router.get("/add_notes", (req, res) => {
  const id = req.query.id;
  if (id) {
    fs.readFile("./data/notes.json", (err, notes) => {
      if (err) throw err;
      const allNotes = JSON.parse(notes);
      const editableNote = allNotes.find((note) => note.id == id);
      res.render("add_notes", {
        title: editableNote.title,
        description: editableNote.description,
        date: editableNote.date,
        id,
      });
    });
  } else {
    res.render("add_notes");
  }
});

//
router.post("/add_notes", upload.single("image"), (req, res) => {
  const id = req.query.id;
  const title = req.body.title;
  const date = req.body.date;
  const description = req.body.description;
  const image = req?.file?.filename || "";

  if (title && date && description) {
    fs.readFile("./data/notes.json", (err, notes) => {
      if (err) throw err;
      const allNotes = JSON.parse(notes);
      const noteById = allNotes.find((note) => note.id == id);
      allNotes.unshift({
        title,
        date,
        description,
        id: crypto.randomUUID(),
        image: image ? image : noteById?.image,
      });
      let newNotes;
      if (id) {
        const notesLessOne = allNotes.filter((note) => note.id != id);
        newNotes = JSON.stringify(notesLessOne);
      } else {
        newNotes = JSON.stringify(allNotes);
      }
      fs.writeFile("./data/notes.json", newNotes, (err) => {
        if (err) throw err;
        res.render("add_notes", { addedNote: true });
      });
    });
  } else {
    res.render("add_notes", {
      title,
      date,
      description,
    });
  }
});

//
router.get("/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./data/notes.json", (err, notes) => {
    if (err) throw err;
    const allNotes = JSON.parse(notes);
    const note = allNotes.find((note) => note.id == id);
    res.render("note", {
      note: note,
    });
  });
});

router.get("/:id/delete", (req, res) => {
  const id = req.params.id;
  fs.readFile("./data/notes.json", (err, notes) => {
    if (err) throw err;
    const allNotes = JSON.parse(notes);
    const notesLessOne = allNotes.filter((note) => note.id != id);
    const newNotes = JSON.stringify(notesLessOne);
    const deletableNote = allNotes.find((note) => note.id == id);

    fs.writeFile("./data/notes.json", newNotes, (err) => {
      if (err) throw err;
      if (deletableNote?.image) {
        fs.unlink(`public/uploads/${deletableNote?.image}`, (err) => {
          if (err) throw err;
        });
      }
      res.render("notes", { notes: notesLessOne, deleted: true });
    });
  });
});

router.get("/api/v1/notes", (req, res) => {
  fs.readFile("./data/notes.json", (err, notes) => {
    if (err) throw err;
    const allNotes = JSON.parse(notes);
    res.json(allNotes);
  });
});

module.exports = router;
