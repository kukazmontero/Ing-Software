const express = require('express');
const router = express.Router();

const Prueba = require('../models/Prueba');
const Note = require('../models/Note');
const Resultado = require('../models/Resultado');

const { isAuthenticated } = require('../helpers/auth');



router.get('/notes/add/:id', isAuthenticated, async (req, res) => {
    const key = req.user.Tipo;
    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{ 
    const prueba = await Prueba.findById(req.params.id).lean();
    //console.log(prueba);
    res.render('notes/new-note', { prueba });
}
});

router.post('/notes/new-note/:id', isAuthenticated, async (req, res) => {
    const { title, description, alternativa1, alternativa2, alternativa3, alternativa4, alternativa5, Respuesta } = req.body;
    const key = req.user.Tipo;
    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{
    const errors = [];
    if (!title ){
        errors.push({text: 'Ingresar titulo'});
    }
    if (!description){
        errors.push({text: 'Ingrese despcripcion'});
    }
    if (!alternativa1){
        errors.push({text: 'Ingrese despcripcion'});
    }
    if (!alternativa2){
        errors.push({text: 'Ingrese despcripcion'});
    }
    if (!alternativa3){
        errors.push({text: 'Ingrese despcripcion'});
    }
    if (!alternativa4){
        errors.push({text: 'Ingrese despcripcion'});
    }
    if (!alternativa5){
        errors.push({text: 'Ingrese despcripcion'});
    }
    if (!Respuesta){
        errors.push({text: 'Ingrese Respuesta Correcta'});
    }
    if(errors.length > 0){
        res.render('notes/new-note', {errors, title, description, alternativa1, alternativa2, alternativa3, alternativa4, alternativa5, Respuesta});
    }
    else{

        const Act = await Prueba.findById(req.params.id).lean();
        const PregAct = Act.preguntas + 1;
        if(PregAct > 20){
        req.flash('error_msg', 'La prueba ya tiene alcanzo el maximo de preguntas');
        res.redirect('/'); 
        }
        else{

        
        console.log(PregAct);
        const aux = req.params.id;
        console.log(Act);
        console.log(req.params.id);

        const newNote = new Note({ title, description, alternativa1, alternativa2, alternativa3, alternativa4, alternativa5, Respuesta });
        newNote.user = req.user.id;
        newNote.prueba = req.params.id;

        await Prueba.findByIdAndUpdate(req.params.id, { preguntas: PregAct });
        if(PregAct==20){
            await Prueba.findByIdAndUpdate(req.params.id, { estado: 'Finalizada' });
        }


        await newNote.save();

        
        req.flash('success_msg', 'Pregunta agregada');
        res.redirect('/pruebas');
        }
    }
}
});

router.post('/notes/resp/:id', isAuthenticated, async (req, res) => {
    const {R, Id} = req.body;
    const note = await Note.findById(req.params.id).lean();

    const prueba = note.prueba;
    const pregunta = req.params.id;
    pruebaaux = await Prueba.findById(prueba).lean();
    const materia = pruebaaux.materia;
    user = req.user.id;
    const aux = await Resultado.findOne({prueba: prueba, user: user, pregunta: pregunta}).lean();
    
    if(aux){
        //console.log(aux.Resultado);
        if(R == note.Respuesta){
            await Resultado.findByIdAndUpdate(aux._id, {Resultado: 1})
            res.redirect(`/notes/${note.prueba}`);
        }
        else{
            await Resultado.findByIdAndUpdate(aux._id, {Resultado: 0})
            res.redirect(`/notes/${note.prueba}`); 
        }
        //console.log(aux.Resultado);
    }
    else{
        //console.log("No existe");
        newResultado = new Resultado({ materia, pregunta, prueba, user});

        if(R == note.Respuesta){
            newResultado.Resultado = 1;
            res.redirect(`/notes/${note.prueba}`);
        }
        else{
            newResultado.Resultado = 0;
            res.redirect(`/notes/${note.prueba}`); 
        }
        
        await newResultado.save();

    }
    
    
});

router.get('/notes/fin/:id', isAuthenticated, async (req, res) => {
    console.log(req.params.id);
    Puntaje = 0;
    const preg = await Prueba.findById(req.params.id).lean();
    console.log(preg);
    const user = req.user.id;
    const Res = await Resultado.find({prueba: req.params.id, user: user}).lean();
    console.log(Res);

    aux1 = Res.length;
    for(i=0;i<aux1;i++){
        if(Res[i].pregunta != "Respondida"){
           Puntaje += Res[i].Resultado;
        await Resultado.findByIdAndDelete(Res[i]._id); 
        }
        
    }

    const prueba = req.params.id;
    const pregunta = 'Respondida';
    const materia = preg.materia;
    //user = req.user.id;
    aux = await Resultado.findOne({prueba: req.params.id, user: user}).lean();
    console.log(aux);
    //console.log(aux);

    if(aux){
        //
        req.flash('error_msg', `Prueba ya realizada `);
        res.redirect('/Pruebas');
    }
    else{
        newResultado = new Resultado({ materia, pregunta, prueba, user});
        newResultado.Resultado = Puntaje;
        await newResultado.save();
        req.flash('success_msg', `Prueba finalizada, tu puntaje es ${Puntaje}`);
        res.redirect('/Pruebas');
    }
        
        
    //console.log(newResultado);
    

});

router.get('/notes/:id', isAuthenticated, async (req, res) => {
    const key = await Prueba.findById(req.params.id).lean();
    console.log(req.user.Tipo);
    if(key.estado == 'Finalizada' || req.user.Tipo != 'estudiante'){
        if(req.user.Tipo != 'estudiante'){
            const notes = await Note.find({prueba: req.params.id}).sort({date: 'asc'}).lean();
            res.render('notes/all-notes', { notes, key});
        }
        else{
            const notes = await Note.find({prueba: req.params.id}).sort({date: 'asc'}).lean();
            res.render('notes/preguntas', { notes, key });
        }
    }
    else{
        req.flash('error_msg', 'La prueba no esta completa');
        res.redirect('/Pruebas');
    }
    
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const key = req.user.Tipo;
    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{
    const note = await Note.findById(req.params.id).lean();
    //console.log(note);
    res.render('notes/edit-note', { note });
}
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const key = req.user.Tipo;
    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{
    const { title, description, alternativa1, alternativa2, alternativa3, alternativa4, alternativa5, Respuesta  } = req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description, alternativa1, alternativa2, alternativa3, alternativa4, alternativa5, Respuesta });
    req.flash('success_msg', 'Nota actualizada');
    res.redirect('/pruebas');
}
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    const key = req.user.Tipo;
    const preg =  await Note.findByIdAndDelete(req.params.id);
    const prueba = await Prueba.findById(preg.prueba).lean();
    console.log(prueba.preguntas);
    const PregAct = prueba.preguntas -1;

    console.log(key);
    if(key == 'estudiante'){
        req.flash('error_msg', 'Usuario no autorizado');
        res.redirect('/');
    }
    else{
    await Prueba.findByIdAndUpdate(preg.prueba, { preguntas: PregAct });
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota borrada');
    res.redirect('/pruebas');
}
});

module.exports = router;