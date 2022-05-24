const express = require('express');
const router = express.Router();

const Prueba = require('../models/Prueba');
const Note = require('../models/Note');

const { isAuthenticated } = require('../helpers/auth');

router.get('/pruebas/add', isAuthenticated, (req, res) => {
    const key = req.user.Tipo;
    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{
       res.render('pruebas/nueva-prueba'); 
    }
});
router.post('/pruebas/nueva-prueba', isAuthenticated, async (req, res) => {
    const key = req.user.Tipo;
    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{
    console.log(req.body);
    const { title, preguntas, estado, materia } = req.body;
    
    const errors = [];
    if (!title ){
        errors.push({text: 'Ingresar titulo'});
    }
    if (!preguntas){
        errors.push({text: 'Ingrese cantidad de preguntas'});
    }
    if (!estado){
        errors.push({text: 'Ingrese estado'});
    }
    if (!materia){
        errors.push({text: 'Ingrese materia'});
    }
    if(errors.length > 0){
        res.render('notes/new-note', {errors, title, preguntas, estado, materia});
    }
    else{
        
        const newPrueba = new Prueba({ title, preguntas, estado, materia });
        newPrueba.user = req.user.id;
        await newPrueba.save();
        console.log(newPrueba); 
        req.flash('success_msg', 'Prueba agregada');
        res.redirect('/');
    }
    }
});

router.get('/pruebas', isAuthenticated, async (req, res) => {
    if(req.user.Tipo!="estudiante"){
        const  aux = "OK";
    const pruebas = await Prueba.find().sort({date: 'desc'}).lean();
    res.render('pruebas/all-pruebas', { pruebas, aux });
    }
    else{
        const pruebas = await Prueba.find().sort({date: 'desc'}).lean();
        res.render('pruebas/pruebas', { pruebas });
    }
});
router.get('/pruebas/historia', isAuthenticated, async (req, res) => {
    if(req.user.Tipo!="estudiante"){
        const  aux = "OK";
        const pruebas = await Prueba.find({materia: 'historia'}).sort({date: 'desc'}).lean();
        res.render('pruebas/all-pruebas', { pruebas, aux });
    }
    else{
        const pruebas = await Prueba.find({materia: 'historia'}).sort({date: 'desc'}).lean();
        res.render('pruebas/pruebas', { pruebas });
    }
    
});
router.get('/pruebas/lenguaje', isAuthenticated, async (req, res) => {
    if(req.user.Tipo!="estudiante"){
        const  aux = "OK";
        const pruebas = await Prueba.find({materia: 'lenguaje'}).sort({date: 'desc'}).lean();
        res.render('pruebas/all-pruebas', { pruebas, aux });
    }
    else{
        const pruebas = await Prueba.find({materia: 'lenguaje'}).sort({date: 'desc'}).lean();
        res.render('pruebas/pruebas', { pruebas });
    }
});
router.get('/pruebas/matematica', isAuthenticated, async (req, res) => {
    if(req.user.Tipo!="estudiante"){
        const  aux = "OK";
        const pruebas = await Prueba.find({materia: 'matematica'}).sort({date: 'desc'}).lean();
        res.render('pruebas/all-pruebas', { pruebas, aux });
    }
    else{
        const pruebas = await Prueba.find({materia: 'matematica'}).sort({date: 'desc'}).lean();
        res.render('pruebas/pruebas', { pruebas });
    }
    
});
router.get('/pruebas/ciencias', isAuthenticated, async (req, res) => {
    if(req.user.Tipo!="estudiante"){
        const  aux = "OK";
        const pruebas = await Prueba.find({materia: 'ciencias'}).sort({date: 'desc'}).lean();
        res.render('pruebas/all-pruebas', { pruebas, aux });
    }
    else{
        const pruebas = await Prueba.find({materia: 'ciencias'}).sort({date: 'desc'}).lean();
        res.render('pruebas/pruebas', { pruebas });
    }
    
});

router.get('/pruebas/edit/:id', isAuthenticated, async (req, res) => {
    const key = req.user.Tipo;
    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{
    const prueba = await Prueba.findById(req.params.id).lean();
    res.render('pruebas/edit-prueba', { prueba });
}
});

router.put('/pruebas/edit-prueba/:id', isAuthenticated, async (req, res) => {
    const key = req.user.Tipo;
    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{
    const { title, preguntas, estado, materia } = req.body;
    await Prueba.findByIdAndUpdate(req.params.id, {title, preguntas, estado, materia });
    req.flash('success_msg', 'Nota actualizada');
    res.redirect('/pruebas');
}
});
router.delete('/pruebas/delete/:id', isAuthenticated, async (req, res) => {
    const key = req.user.Tipo;
    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{
    const preguntas = await Note.find({prueba: req.params.id}).lean();    
    for(i=0;i<preguntas.length;i++){
        await Note.findByIdAndDelete(preguntas[i]._id);
    }

    await Prueba.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Prueba borrada');
    res.redirect('/pruebas');
}
});
module.exports = router;