const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({
    usernameField: 'RUT',
    passwordField: 'Password'
}, 
    async (username, password, done) => {console.log('buscando');
    const user = await User.findOne({RUT: username});
    
    if(!user) {
        
        return done(null, false, { message: 'Usuario no encontrado' });
    }
    else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        }
        else{
            return done(null, false, { message: 'Contraseña Incorrecta' });
        }
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});