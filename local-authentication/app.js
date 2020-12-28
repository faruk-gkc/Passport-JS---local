const express = require('express')
const app = express()
const exphbs  = require('express-handlebars');// EXPRESS HANDLEBARS REQUİRE ETTİK.
require('./config/db'); // DATABASE BAĞLANTISINI REQUİRE ETTİK
const User = require('./models/userModel'); // Kayıtlı Kullanıcıları index sayfasına yazdırmak için require ettik..
const flash = require('connect-flash'); // Bunu yüklerken aşağıdakileri de yüklemek zorundayız.Çünkü o komutlar deprecated olmuş.
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require("passport");


//Form url encoded
app.use(express.urlencoded({extended:true}))



//Flash Mesaj Middleware (EXPRESS 4 ' E GÖRE )
app.use(cookieParser("passportsecret"));
app.use(session({
  secret:"passportsecret",
  cookie: { maxAge: 60000},
  resave: false, 
  saveUninitialized: true,}));
app.use(flash());

//PASSPORT INITIALIZE İŞLEMLERİ
app.use(passport.initialize());
app.use(passport.session());

//Global flash messages -- 'RES.LOCALS' OLAYI
//FLASH'I TÜM ROUTER'DA KULLANMAK İÇİN BUNU YAZIYORUZ. YAZMASSAK AYRI AYRI ROUTERLARDA YAZMAK GEREKİR.
app.use((req, res, next)=> {
  res.locals.flashSuccess = req.flash('flashSuccess');
  res.locals.flashError = req.flash('flashError');
  
  //PASSPORT FLASH
  res.locals.passportFailure = req.flash('error');
  res.locals.passportSuccess = req.flash('success');

  //LOGİN OLMUŞ KULLANICI -- views'ların template'larında kullanmak için bunu yaptık.
  //index.handllebars'ta gösterdik..
  res.locals.user = req.user;
  
  next(); // bunu yazmadan çalışmaz..
});

//BODY PARSER MİDDLEWARE
// app.use(bodyParser.urlencoded({ extended: true }));


//userRouter Middleware; // BUNUN FLASH MESAJDAN SONRA ÇALIŞMASI GEREKİYOR.
const userRouter = require('./routers/users') 
app.use(userRouter);

//EXPRESS HANDLEBARS MİDDLEWARE
app.engine('handlebars', exphbs({defaultLayout: 'mainLayout'}));
app.set('view engine', 'handlebars');

app.get("/", (req, res, next) => {
  User.find({})
    .then(users => {
      //EKRANA YAZDIRMIYOR İDİ. BU ŞEKİLDE YAZARAK HATAYI ÇÖZDÜM... ÖNEMLİİ..
      res.render("pages/index", { users: users.map(user =>user.toJSON()) });
    })
    .catch(err => console.log(err));
});

//Herhangi bir saçma url (uzantı) isteğinde '404 Not Found' DÖNDERSİN..
app.use((req,res,next)=> {
  res.render('static/404')
})

app.listen(3000, (req,res)=> {
    console.log("Sistem Çalışmaya Hazır");
})