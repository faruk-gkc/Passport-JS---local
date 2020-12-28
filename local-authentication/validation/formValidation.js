module.exports.registerValidation = (username,password) =>{

    const errors = [];

    if(username === ""){
        errors.push({message: "Kullanıcı Adı Boş Geçilemez"})
    }

    if(password === ""){
        errors.push({message: "Şifre Adı Boş Geçilemez"})
    }

    if(password.length < 6){
        errors.push({message: "Şifre 6 karakterden küçük olamaz"})
    }

    return errors;
}