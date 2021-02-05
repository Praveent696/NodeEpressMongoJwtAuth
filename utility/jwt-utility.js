const jwt = require('jsonwebtoken');
const config = require('config');
const secrateKey = config.get('jwtTokenSecureKey');
const refreshSecrateKey = config.get('jwtRefreshTokenSecureKey');


const jwtUtility = {
    signJwt: async (payload,expiresIn='20m') =>{
        try{
            let token = await jwt.sign(
                payload,
                secrateKey,
                { expiresIn: expiresIn }
            );
            return token;
        }
        catch(e){
            console.error(e);
            return '';
        }

    },
    signRefreshToken: async (payload) =>{
        try{
            let token = await jwt.sign(
                payload,
                refreshSecrateKey
            );
            return token;
        }
        catch(e){
            console.error(e);
            return '';
        }

    },
    decodeJWT: async (token) =>{
        try{
            let isValid = await jwt.verify(token,secrateKey);
            console.log(`is valid jwt key ${isValid}`)
            return isValid;
        }
        catch(e){
            return null;
        }
    
    },
    decodeRefreshToken: async (token) =>{
        try{
            let isValid = await jwt.verify(token,refreshSecrateKey);
            return isValid;
        }
        catch(e){
            console.error(e);
            return null;
        }
    
    }
}

module.exports = jwtUtility;