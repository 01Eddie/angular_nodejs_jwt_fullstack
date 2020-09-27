const {Router} = require('express');
const router = Router();

const User = require('../models/User')

const jwt = require('jsonwebtoken')

router.get('/',(req,res) => res.send('Hola Mundo'))

router.post('/signup', async (req, res) => {
    //console.log(req.body);
    //res.send('testing sign up')
    const { email, password } = req.body;
    const newUser = new User({email,password});
    //console.log(newUser);
    await newUser.save();
    //res.send("Testing signup");
    const token = jwt.sign({_id: newUser._id }, 'secretKey')
    
    res.status(200).json({token})

})

router.post('/signin', async(req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) return res.status(401).send("El email no existe");
    if(user.password !== password) return res.status(401).send('Contraseña erronea'); //Esto  no es recomendable para recuperar la contraseña es muy simple

    const token = jwt.sign({_id: user._id}, 'secretKey'); //El secretKey tiene q ser igual que el otro secretKey
    return res.status(200).json({token});
})

router.get('/task', (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Task one',
            description: 'lorem ipsum',
            date: '2020-02-09T12:29:00-211Z'
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'lorem ipsum',
            date: '2020-02-09T12:29:00-211Z'
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'lorem ipsum',
            date: '2020-02-09T12:29:00-211Z'
        }
    ])
})

router.get('/private-tasks', verifyToken, (req,res) => {
    res.json([
        {
            _id: 1,
            name: 'Task one',
            description: 'lorem ipsum',
            date: '2020-02-09T12:29:00-211Z'
        },
        {
            _id: 2,
            name: 'Task two',
            description: 'lorem ipsum',
            date: '2020-02-09T12:29:00-211Z'
        },
        {
            _id: 3,
            name: 'Task three',
            description: 'lorem ipsum',
            date: '2020-02-09T12:29:00-211Z'
        }
    ])
})

router.get('/profile', verifyToken, (req,res) => {
    res.send(req.userId);
})

module.exports = router;

function verifyToken(req, res, next) {
    //console.log(req.headers.authorization)
    if (!req.headers.authorization) {
        return res.status(401).send(' (No estas autorizado a pedir esto)Autorizado Request');
    }

    const token = req.headers.authorization.split(' ')[1]
    //['Bear', '']
    if (token== 'null') {
        return res.status(401).send('Sin Autorizado Request');
    }

    const payload = jwt.verify(token, 'secretKey')
    //console.log(payload)
    req.userId = payload._id;
    next();
}