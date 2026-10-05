import jwt from "jsonwebtoken"

async function encrypt(user){
    try {
        return await jwt.sign(user,"mySecretKey",{expiresIn:"1D"})  // jwt.sign takes 3 parameters 1:- payload,2-secret key,3- duration
    } catch (error) {
        console.error(error)
    }

}
export default encrypt;
