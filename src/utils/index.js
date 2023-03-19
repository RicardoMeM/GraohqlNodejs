const {jwt, sign, verify} = require('jsonwebtoken');
const {bcrypt, genSalt, hash, compare} =  require('bcrypt')


const SECRET = 'edteam'

const getUserId = (request) =>{
     const header = request.headers.get('authorization')

     if(header !== null){
        const token = header.split(' ')[1]
        const tokenPayload = verify(token, SECRET)
        const userId = tokenPayload.userId

        return userId
     }

     throw new Error('Authentication required')
}

const hashPassword = async password => {
    if(password.lengh < 6 ){
        throw new Error('Password must be 6 characters or longer')
    }
     const salt = await genSalt(10)
     return hash(password, salt)
}

const validatePassword = async (requestPassword, password) => {
    return await compare(requestPassword, password)
}

const generateToken = (userId) => {
 return sign({userId}, SECRET, {expiresIn: '2 days'} )
}

module.exports = {getUserId, hashPassword, validatePassword, generateToken}