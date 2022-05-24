const express = require('express');
const router = express.Router();


const User = require('../models/User');
const { isAuthenticated } = require('../helpers/auth');


const passport = require('passport');

router.get('/users/signin',  (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin',  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'signin',
    failureFlash: true
}));

router.get('/users/ver-perfil',  isAuthenticated, (req, res) => {
    res.render('users/perfil');
    console.log(req.user);
});

router.get('/users/edit',  isAuthenticated, (req, res) => {
    res.render('users/cambio');
});

router.post('/users/cambio',  isAuthenticated, async (req, res) => {
    const { Password } = req.body;
    const cambio = req.user.Password;
    
    const errors = [];
    if (Password.length <=0 ){
        errors.push({text: 'Ingrese Contraseña'});
    } 
    if(errors.length > 0){
        res.render('users/cambio', {errors, Password});
    }
    else{

        const newUser = new User({Password});
        //console.log(Password);
        const aux = await newUser.encryptPassword(Password);
        //console.log(aux);
        await User.findByIdAndUpdate(req.user.id, { Password: aux });
        req.flash('success_msg', 'Estas registrado');
        res.redirect('/');
    }

});

router.get('/users/signup', isAuthenticated,  (req, res) => {
    const key = req.user.Tipo;
    if(key == 'administrador'){
    res.render('users/signup');
    }
    else{
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/'); 
    }
    
});

router.post('/users/signup', isAuthenticated, async (req, res) => {
    const key = req.user.Tipo;
    console.log(key);

    if(key == 'administrador'){
    const { RUT, Password, Tipo, Nombre} = req.body;
    //console.log(req.body);
    const errors = [];
    if (RUT.length <=0 ){
        errors.push({text: 'Ingrese RUT'});
    }
    if (Nombre.length <=0 ){
        errors.push({text: 'Ingrese Nombre'});
    }
    if (Tipo == 'aux' ){
        errors.push({text: 'Ingrese tipo de usuario'});
    }
    if (Password.length <=0 ){
        errors.push({text: 'Ingrese Contraseña'});
    } 
    if(errors.length > 0){
        res.render('users/signup', {errors, RUT, Password, Tipo, Nombre});
    }
    else{
        const rutUs = await User.findOne({RUT: RUT});
        if(rutUs){
            req.flash('error_msg', 'El RUT ingresado ya esta registrado');
            res.redirect('signup'); 
        }
        else{
        const newUser = new User({ RUT, Password, Tipo, Nombre});
        newUser.Password = await newUser.encryptPassword(Password);
        await newUser.save();
        //console.log(newUser); 
        req.flash('success_msg', 'Estas registrado');
        res.redirect('/');
        }
    }
}
else{
    req.flash('error_msg', 'Usuario no autorizado');
    res.redirect('/'); 
}
});

router.get('/users/logout',  (req, res) => {
    req.logout();
    res.redirect('/')
});

module.exports = router;