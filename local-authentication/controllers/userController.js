const formValidation = require('../validation/formValidation')// validasyon işlemini require ettik
const bcrypt = require('bcrypt');
const User = require('../models/userModel')
const passport = require('passport')
require("../authentication/passport/local") // PASSPORT JS'İ BURAYA ÇAĞIRDIK..

module.exports.getUserLogin =  (req, res, next) => {
    res.render('pages/login')
    
}
module.exports.getUserLogout = (req, res, next) => {
    req.logout();
    res.redirect("/login");
  };

module.exports.getUserRegister =   (req, res, next) => {
    res.render('pages/register')
}

module.exports.postUserLogin =  (req, res, next) => {
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash:true })(req,res,next); // BİTTİKTEN SONRA İSTEK , CEVAP VE BİR SONRAKİ ADIMA GEÇ KISMI ÇALIŞSIN
        //AUTHENTİCATİON ' U REQ,RES VE NEXT'E GÖRE ÇALIŞACAK..

    
}

module.exports.postUserRegister =  (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const errors = [];
    const formValidateErrors = formValidation.registerValidation(username,password)//validation işlemi
    // Form Validation İşlemi
    if(formValidateErrors.length > 0){
       return res.render('pages/register',{
            username:username,
            password:password,
            errors:formValidateErrors
        })

    }
    //Veritabanında aynı kullanıcı ismi var mı onun kontrolünü yaptık..
    User.findOne({username})
    .then(user => {
         //Veritabanında aynı kullanıcı ismi var mı onun kontrolünü yaptık.
        if(user){
            errors.push({message:"Girdiğiniz Kullanıcı Adı Daha Önceden Alınmış" })
            return res.render('pages/register', {
                username,
                password,
                errors
        })

    }
        //Şifreleme yaptık. Dökümantasyonun aynısı bu..
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
                if(err) throw err;// HATA VARSA HATAYI FIRLAT YANİ GÖSTER;

                //HATA YOKSA -- Usere Kaydetme İşlemi Yaptık artık..
                    const newUser = new User({
                    username:username,
                    password:hash
                    })

                newUser.save()
                        .then(()=> {
                                console.log("Başarılı"); 
                                req.flash("flashSuccess","Başarıyla Kayıt Olundu");
                                res.redirect('/');
                                })
                        .catch(err=> console.log("Hata Çıktı " + err))
            });
        });
})
    .catch((err) => console.log("Hata: " +err));

    
}