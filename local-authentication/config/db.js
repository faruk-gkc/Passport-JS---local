const mongoose = require('mongoose'); // Mongoose`require()` ettik

mongoose.connect('mongodb://localhost/db_passport', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log("veritabanına bağlanıldı"))
.catch(hata => console.log("db baglantı hatası"));;

    