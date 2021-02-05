const jwtUtility = require('../utility/jwt-utility');

const auth = async (req, res, next) => {
    try{
        let token = req.header('Authorization');
        if(token){
            token = token.split(' ')[1]
        }

        let decodedToken = await jwtUtility.decodeJWT(token);

        if(!decodedToken){
            return res.status(401).json({ errors: [ { message: 'Unauthorised' } ] })
        }

        req.user = decodedToken.user;
        next();
    }
    catch(e){
        return res.status(401).json({ errors: [ { message: 'Unauthorised' } ] })
    }
};

module.exports = auth;