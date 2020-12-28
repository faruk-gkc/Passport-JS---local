const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport')
const bcrypt = require('bcrypt');
const User = require('../../models/userModel'); 

passport.use(new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
       
        // (HATA VAR MI? , USER VAR MI? ,  MESAJ YAZILACAK MI?)

        if (err) { return done(err, null, "Bir Hata Oluştu, Lütfen Tekrar Deneyiniz."); } // hata var ve user bulunamadı
        
        if (!user) { return done(null, false, "Kullanıcı Bulunamadı"); }  // hata yok ve user bulunamadı
        
        bcrypt.compare(password, user.password, (err, result) => {
            if(result) { //doğru ise
                return done(null,user, "Başarıyla giriş yapıldı.")
            }else{
                return done(null,false,"Yanlış Şifre")
            }
        });
      });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done)=> {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });