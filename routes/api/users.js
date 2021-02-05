const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jwtUtility = require('../../utility/jwt-utility');
const auth = require('../../middlewares/auth')

const User = require('../../models/User')

router.post('/',    
    [
        check('name','Name field is required').not().notEmpty(),
        check('email','Please enter valid email').not().notEmpty().isEmail(),
        check('password','Please enter valid password').not().notEmpty().isLength({min:6})
    ]
, async (req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body
        
        // check if user already Exists
        let user = await User.findOne({email:email})
        console.log(user)
        if(user){
            return res.status(400).json({errors: [{message:'User already exists'}] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
        name,
        email,
        avatar,
        password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        let token = await jwtUtility.signJwt(payload,'5 days');
        res.status(200).json({token})
    }
    catch(e){
        console.error(e);
        res.status(500).send('Server error');
    }

})

module.exports = router;