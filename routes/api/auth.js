const express = require('express');
const User = require('../../models/User');
const UserLogin = require('../../models/UserLogin');
const { check, validationResult } = require('express-validator');
const jwtUtility = require('../../utility/jwt-utility');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('../../middlewares/auth');

router.delete('/logout', auth ,async (req,res)=>{
    await UserLogin.findOneAndDelete({user: req.user.id , token:  req.header('Authorization').split(' ')[1] })
    res.status(200).json({message: `logout successful`});
});

router.post('/token_refresh' ,async (req,res)=>{
    let { refresh_token } = req.body;
    let validRefreshToken = await jwtUtility.decodeRefreshToken(refresh_token);
    if(!validRefreshToken){
        return res.status(400).json({ errors: [{message:'Invalid Refresh Token!!'}] });
    }

    let isRefreshTokenExist = await UserLogin.findOne({refreshtoken:refresh_token})
    if(!isRefreshTokenExist){
        return res.status(400).json({ errors: [{message:'Invalid Refresh Token!!'}] });
    }

    let payload = {
        user: validRefreshToken.user
    }
    
    let token = await jwtUtility.signJwt(payload)

    let UserLoginObj = {
        user : validRefreshToken.user.id,
        token :token,
        updated: Date.now()
    }

    await UserLogin.findOneAndUpdate({user: validRefreshToken.user.id},{ $set: UserLoginObj },
        { new: true, upsert: true, setDefaultsOnInsert: true })

    res.status(200).json({token:token})
})

router.post('/', 
  [
      check('email', 'Please Enter valid email').isEmail(),
      check('email', 'Please Enter email').notEmpty(),
      check('password', 'Please Enter password').notEmpty()
  ]
 ,async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
    }


    const { email, password } = req.body;

    let user = await User.findOne({email});

    if(!user){
        return res.status(200).json({ errors: [{message: 'Invalid Creds!!'}] })
    }

    let isPasswordMatch = await bcrypt.compare(password,user.password);

    if(!isPasswordMatch){
        return res.status(200).json({ errors: [{message: 'Invalid Creds!!'}] })
    }

    let payload = {
        user: {
            id:user.id
        }
    }

    let token = await jwtUtility.signJwt(payload);
    let refreshToken = await jwtUtility.signRefreshToken(payload);

    let userLogin = {
        user: user,
        token : token,
        refreshtoken : refreshToken
    };

    let user_login = new UserLogin(userLogin);
    user_login.save();

    res.status(200).json({token,refresh_token:refreshToken})
})

module.exports = router;