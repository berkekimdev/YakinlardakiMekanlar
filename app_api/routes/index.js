var express = require("express");
const jwt = require("express-jwt");
var router = express.Router();
const auth = jwt.expressjwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload',
    algorithms:['sha1', 'RS256', 'HS256']
});
var ctrlMekanlar = require("../controllers/mekanlar");
var ctrlYorumlar = require("../controllers/yorumlar");
var ctrlDogrulama = require("../controllers/dogrulama");

router
.route("/mekanlar/:mekanid")
.get(ctrlMekanlar.mekanGetir)
.put(ctrlMekanlar.mekanGuncelle)
.delete(ctrlMekanlar.mekanSil);

router
.route("/mekanlar")
.get(ctrlMekanlar.mekanlariListele)
.post(ctrlMekanlar.mekanEkle);

/*
router
.route("/mekanlar/:mekanid/yorumlar")
.post(auth, ctrlYorumlar.yorumEkle);

router
.route("/mekanlar/:mekanid/yorumlar/:yorumid")
.get(ctrlYorumlar.yorumGetir)
.put(auth, ctrlYorumlar.yorumGuncelle)
.delete(auth, ctrlYorumlar.yorumSil);
*/

router
.route("/mekanlar/:mekanid/yorumlar")
.post(ctrlYorumlar.yorumEkle);

router
.route("/mekanlar/:mekanid/yorumlar/:yorumid")
.get(ctrlYorumlar.yorumGetir)
.put(ctrlYorumlar.yorumGuncelle)
.delete(ctrlYorumlar.yorumSil);

router
.route("/kayitol")
.post(ctrlDogrulama.kayitOl);

router
.route("/girisyap")
.post(ctrlDogrulama.girisYap);

module.exports=router;
