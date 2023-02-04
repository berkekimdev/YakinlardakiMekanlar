var express = require('express');
var router = express.Router();
var ctrlMekanlar= require('../controllers/mekanlar');
var ctrlDigerleri= require('../controllers/digerleri');
const auth=require("../auth/auth")
/* GET home page. */
router.get('/', ctrlMekanlar.anaSayfa);
router.get('/mekan/:mekanid', ctrlMekanlar.mekanBilgisi);
router.get('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumEkle);
router.post('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumumuEkle);
router.get('/hakkinda', ctrlDigerleri.hakkinda);

router.get('/girisyap', ctrlDigerleri.getirGirisYap);
router.post('/girisyap', ctrlDigerleri.girisYap);
router.get('/kayitol', ctrlDigerleri.getirKayitOl);
router.post('/kayitol', ctrlDigerleri.kayitOl);
router.get('/adminsayfasi',auth.verifyToken, ctrlDigerleri.adminSayfasi);
router.get('/mekanguncelle/:mekanid', ctrlDigerleri.mekanGuncelleSayfasi);
router.post('/mekanguncelle/:mekanid', ctrlDigerleri.mekanGuncelle);
router.get('/yenimekanekle', ctrlDigerleri.yeniMekanEkleSayfasi);
router.post("/yenimekanekle",ctrlDigerleri.yeniMekanEkle)
router.get("/mekansil/:mekanid",ctrlDigerleri.mekanSil)

module.exports = router;
