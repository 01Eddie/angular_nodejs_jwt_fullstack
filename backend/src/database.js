const mongoose =require('mongoose')

mongoose.connect('mongodb://localhost/angular-auth',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

    .then(db => console.log('La base de datos esta conectado'))
    .catch(err => console.log(err))