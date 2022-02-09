const { Router } = require('express');
const router = Router();
// library for encryptyng passwords
const bcrypt = require('bcryptjs');
// get methods to checking and validation of correctly data
const { check, validationResult } = require('express-validator');
// connect library to authorizate users
const jwt = require('jsonwebtoken');
// connect config to taking token for authorization
const config = require('config');
// connect model of creating new users
const User = require('../models/User');

////////////////////////////
// LOGIC OF REGISRTATE USERS
router.post('/register',
    // massive of validators for checking recieved data
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6})
    ],
    async (req, res) => {
    try {
        // checking of data with importing methods
        const errors = validationResult(req);
        
        // if we get errors on validation, we are return error to frontend
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Неккоректные данные при регистрации'
            })
        }

        // get email and pass from request object
        const { email, password } = req.body
        
        const candidate = await User.findOne({ email });

        if (candidate) {
            return res.status(400).json({message: 'Такой пользователь уже существует'})
        }

        // encrypting entered password
        const hashedPassword = await bcrypt.hash(password, 12);
        // add new user with his data
        const user = new User({ email, password: hashedPassword })
        
        await user.save();

        res.status(201).json({message: 'Пользователь создан'})
    } catch (e) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
    }
});

//////////////////////////
// LOGIC OF LOGINNING USERS
router.post('/login',
    // massive of validators for checking recieved data
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        // for logining, user must only having a password, we dont must to checking him
        check('password', 'Введите пароль'), exists();
    ]
    async (req, res) => {
    try {
        // checking of data with importing methods
        const errors = validationResult(req);
        
        // if we get errors on validation, we are return error to frontend
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Неккоректные данные при входе в систему'
            })
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email })

        // finding user of getting in form data
        if (!user) {
            return res.status(400).json({message: 'Пользователь не найден'})
        }

        // puting into variasble comparing of two password - entering and password from database
        const isMatch = await bcrypt.compare(password, user.password)

        // if this password didnt find on our database, we are write to frontend error
        if(!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль, попробуйте снова'})
        };

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        );

        res.json({ token, userId: user.id });

    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
});

module.exports = router;