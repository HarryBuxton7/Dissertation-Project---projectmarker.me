const express = require('express');
const isLoggedIn = require('./middleware/isLoggedIn');

const router = express.Router();

router.post('/login', require('./routes/loginRoute'));
router.post('/register', require('./routes/registerRoute'));

router.get('/papers', isLoggedIn, require('./routes/getUserPapersRoute'));
router.get('/comparePapers', isLoggedIn, require('./routes/comparePapersRoute'));

router.get('/papers/:id', isLoggedIn, require('./routes/getUserPaperRoute'));
router.put('/papers/:id', isLoggedIn, require('./routes/updatePaperRoute'));

router.get('/cohortPapers/', isLoggedIn, require('./routes/getPapersFromCohortRoute'));

router.delete('/papers/:id', isLoggedIn, require('./routes/deletePaperRoute'));

router.get('/users', isLoggedIn, require('./routes/getUsersRoute'));

router.post('/uploadCSV', isLoggedIn, require('./routes/uploadCSVRoute'));



module.exports = router;