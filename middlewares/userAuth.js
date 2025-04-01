const jwt = require('jsonwebtoken')
const fetchSecrets = require('./fetchSecrets')
const fetchModels = require('../queries/fetchModels')
const dotenv = require('dotenv');
dotenv.config();
const checkAuth = async(req, res, next) => {
    const Models = await fetchModels()
    const User = Models.User
    let token
    try {
        token = req.headers.authorization.split(" ")[1]
    } catch(err) {
        console.log('Token fetch error', err);
        return res.status(404).json({success:false, error:"token not found"})
    }
    // console.log(token);
    try {
        let secrets = process.env
        const decode = jwt.verify(token, secrets.JWT_SECRET_USER)
        req.userData = decode
        let user = await User.findAll({
            where:{
                token:decode.id
            }
        })
        if(user.length==0) return res.status(400).json('You\'re not authorised.')
        next()
    } catch(err) {
        console.log('JWT Token verification failed.', err);
        return res.status(401).json({success: false, error: "You're not authorized."})
    }
}
module.exports = checkAuth