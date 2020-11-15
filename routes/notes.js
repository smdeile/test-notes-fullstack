const { Router } = require('express');
const Note = require('../models/NoteModel')
const router = Router();
const path = require('path');
const multer = require("multer");
const fs = require('fs');

const imageDir=path.join(__dirname, "..", "public/avatar_temp");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageDir)
      },
    filename: function (req, file, cb) {
              const ext = path.parse(file.originalname).ext;
              cb(null, Date.now() + ext);
            },
  })

const upload = multer({ storage: storage, limits: { fileSize: 2000000 }});

router.get('/', async (req, res)=>{
   const notes = await Note.find({});
  
   const isPaginate= (notes)=> {if (notes.length % 5 > 1) {return true}};
   const firstFive=(notes)=> {if(notes.length !== 0 && !isPaginate(notes)) { return notes.slice(0, 5)}};
firstFive(notes)
   res.render('index',
    {
        name: 'notes',
        isIndex: true,
        notes: firstFive(notes),
        isPaginate: !isPaginate(notes)
    });
});
router.get('/show-all', async (req, res)=>{
    const notes = await Note.find({});
    res.render('index',
     {
         name: 'notes',
         isIndex: true,
         notes,
         isPaginate: false
     });
 });

router.get('/create', (req,res)=>{
    res.render('create', {
        name: 'Create',
        isCreate: true
    });
})

router.post('/create', upload.single('image'), async (req, res, next)=>{
    try { 
    const note = new Note ({
    title: req.body.title,
    note: req.body.note,
    img: { 
                data: fs.readFileSync(path.join(imageDir + '/' + req.file.filename)), 
                contentType: 'image/png'
            }
})
await note.save();
} catch (err) {console.log(err);} 
next (res.redirect('/'))
})

router.post('/delete', async (req, res) => {

    await Note.findOneAndRemove({_id: req.body.id});
     res.redirect('/')
  })

module.exports = router;