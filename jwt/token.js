import jwt from "jsonwebtoken"
const makeJsonWebToken = (userId) => {
    jwt.sign(userId, process.env.SECRET_KEY)
}

export { makeJsonWebToken }