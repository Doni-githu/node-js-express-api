import jwt from "jsonwebtoken"
const makeJsonWebToken = (userId) => {
    return jwt.sign(userId, process.env.SECRET_KEY)
}

export { makeJsonWebToken }