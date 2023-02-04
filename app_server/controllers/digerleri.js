const e = require("express");
const axios=require("axios");
const { response } = require("../../app");

var apiSecenekleri = {
    sunucu: "http://localhost:3000",
    apiYolu: "/api/",
};

const hakkinda = function(req, res, next) {
    res.render('hakkinda', { title: 'Hakkında Sayfası' });
};

const  mesafeyiFormatla = function(mesafe) {
    var yeniMesafe, birim;
    if (mesafe > 1) {
        yeniMesafe = parseFloat(mesafe).toFixed(1);
        birim = " km";
    } else {
        yeniMesafe = parseInt(mesafe * 1000, 10);
        birim = " m"
    }
    return yeniMesafe + birim;
};

const adminSayfasiOlustur = function(res, mekanListesi) {
    var mesaj;
    if (!(mekanListesi instanceof Array)) {
        mesaj = "API HATASI: Bir şeyler ters gitti!";
        mekanListesi = [];
    } else {
        if (!mekanListesi.length) {
            mesaj = "Civarda herhangi bir mekan bulunamadı!";
        }
    }

    res.render("adminsayfasi", {
        "baslik" : "Admin Sayfası",
        "sayfaBaslik" : {
            "siteAd" : "Admin Sayfası",
            "slogan" : "Mekanları Düzenle"
        },
        "mekanlar" : mekanListesi,
        "mesaj" : mesaj
    });
};

const adminSayfasi = function(req, res, next) {
    axios.get(apiSecenekleri.sunucu + apiSecenekleri.apiYolu + "mekanlar", {
        params : {
            enlem : req.query.enlem,
            boylam : req.query.boylam
        },
    }).then(function(response) {
        console.log("response", response.data);
        var i, mekanlar;
        mekanlar = response.data;
        for (i = 0; i < mekanlar.length; i++) {
            mekanlar[i].mesafe = mesafeyiFormatla(mekanlar[i].mesafe);
        }
        adminSayfasiOlustur(res, mekanlar);
    }).catch(function(hata) {
        adminSayfasiOlustur(res, hata);
    });
};

const getirGirisYap = (req,res,next)=>{
    res.render('girisyap', { title: 'Giriş Yap Sayfası' });
};

const girisYap = function(req, res, next) {
    const {eposta,sifre} = req.body;
    if (!eposta || !sifre) {
        res.status(404).json({"hata":"Tüm alanlar gerekli"})
        return;
    }
    const body = {
        sifre,
        eposta
    }
    const{sunucu,apiYolu} = apiSecenekleri;
    axios.post(sunucu.concat(apiYolu) + "girisyap", body)
    .then((response)=>{
        req.session.token=response.data.token;
        res.redirect("/adminsayfasi/?enlem=34&boylam=45")
        console.log(res.data);
    }).catch((err)=>{
        console.log(err.name);
        res.redirect("/girisyap")
    })
};

const getirKayitOl = (req,res,next)=>{
    res.render('kayitol', { title: 'Kayıt Ol Sayfası' });
};

const kayitOl = function(req, res, next) {
    if(!req.body.sifre || !req.body.eposta || !req.body.adsoyad) {
        res.status(404).json({"hata":"Tüm alanlar gerekli"})
        return;
    }
    const body={
        sifre:req.body.sifre,
        eposta:req.body.eposta,
        adsoyad:req.body.adsoyad
    }
    const{sunucu,apiYolu} = apiSecenekleri;
    axios.post(sunucu.concat(apiYolu) + "kayitol", body)
    .then((response) => {
        console.log(response.data.token + "token");
        let token=response.data.token;
        res.redirect("/girisyap")
    }).catch((err) => {
        res.redirect("/kayitol")
    })
};

const mekanGuncelle = function(req, res, next) {
   
    console.log(req.body.imkanlar);

    const body={
        ad:req.body.ad,
        adres:req.body.adres,
        imkanlar:req.body.imkanlar,  
        enlem: req.body.enlem,
        boylam:req.body.boylam,
        gunler1: req.body.gunler1,
        acilis1: req.body.acilis1,
        kapanis1: req.body.kapanis1,
        kapali1: req.body.kapali1,
        gunler2: req.body.gunler2,
        acilis2: req.body.acilis2,
        kapanis2: req.body.kapanis2,
        kapali2: req.body.kapali2
    }

    console.log(body);
    axios.put(apiSecenekleri.sunucu.concat(apiSecenekleri.apiYolu) + "mekanlar/" + req.params.mekanid, body)
    .then((response) => {
        res.redirect("/adminsayfasi/?enlem=34&boylam=45")
    }).catch((err) => {
        console.log("hata oluştu");
    })
};

const mekanGuncelleSayfasi = (req,res,next)=>{
    axios.get(apiSecenekleri.sunucu.concat(apiSecenekleri.apiYolu) + "mekanlar/" + req.params.mekanid)
    .then((response)=>{
        let str ="";
        response.data.koordinat = {
            "enlem" : response.data.koordinat[0],
            "boylam" : response.data.koordinat[1]
        }
        response.data.imkanlar.forEach((item,index) => {
            if(index != response.data.imkanlar.length-1)
                str+=item+",";
           else
           str+=item   
        })
        res.render("mekanguncelle", {
            mekanDetay:response.data,
            imkanlar:str,
            kapali1:new String(response.data.saatler[0].kapali).replace('""'),
            kapali2:new String(response.data.saatler[1].kapali).replace('""')
        })
    })
};

const yeniMekanEkle=(req,res)=>{
    const body={
        ad:req.body.ad,
        adres:req.body.adres,
        imkanlar:req.body.imkanlar,  
        enlem: req.body.enlem,
        boylam:req.body.boylam,
        gunler1: req.body.gunler1,
        acilis1: req.body.acilis1,
        kapanis1: req.body.kapanis1,
        kapali1: req.body.kapali1,
        gunler2: req.body.gunler2,
        acilis2: req.body.acilis2,
        kapanis2: req.body.kapanis2,
        kapali2: req.body.kapali2
   }
   console.log(body);
    axios.post(apiSecenekleri.sunucu.concat(apiSecenekleri.apiYolu) + "mekanlar/", body)
    .then((response) => {
        res.redirect("/adminsayfasi/?enlem=34&boylam=45")
    }).catch((err) => {
        console.log("hata oluştu");
    })

};

const yeniMekanEkleSayfasi = function(req, res, next) {
    res.render('yenimekanekle', { title: 'Yeni Mekan Ekle Sayfası' });
};

const mekanSil = (req,res) => {
    const{mekanid}=req.params;
    axios.delete(apiSecenekleri.sunucu.concat(apiSecenekleri.apiYolu) + "mekanlar/"+mekanid)
    .then((res)=>{
        res.redirect("/adminsayfasi/?enlem=34&boylam=45")
    }).catch((err)=>{
        res.redirect("/adminsayfasi/?enlem=34&boylam=45")
    })
};

module.exports={
    hakkinda,
    girisYap,
    kayitOl,
    adminSayfasi,
    mekanGuncelle,
    getirGirisYap,
    getirKayitOl,
    mekanGuncelleSayfasi,
    yeniMekanEkleSayfasi,
    yeniMekanEkle,
    mekanSil
}