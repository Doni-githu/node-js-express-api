import jwt from "jsonwebtoken"

const makeJsonWebToken = userId => {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "30d" })
    return token
}

const getJsonWebToken = token => {
    const userId = jwt.verify(token, process.env.SECRET_KEY, { complete: true })
    return userId
}

export { makeJsonWebToken, getJsonWebToken }