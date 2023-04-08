import User from "../modules/auth.js";
import { Router } from "express";
import bcrypt from "bcrypt"
import { getJsonWebToken, makeJsonWebToken } from "../jwt/token.js"

const router = Router()

router.post('/', async (req, res) => {
    const { name, email, password } = req.body.user

    const candidate = await User.findOne({ email })

    if (candidate) {
        res.status(400).json({ message: "Email taken" })
        return
    }

    const hashPassword = await bcrypt.hash(password, 10)


    const newUser = {
        username: name,
        email: email,
        password: hashPassword
    }

    const user = await User.create(newUser)
    const token = makeJsonWebToken(user._id)
    res.status(200).send({ user: user, token })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body.user
    const existUser = await User.findOne({ email })
    if (!existUser) {
        res.status(400).json({ message: "User not found" })
        return
    }

    const CheckPassword = await bcrypt.compare(password, existUser.password)
    if (!CheckPassword) {
        res.status(400).json({ message: "Password is wrong" })
        return
    }

    const token = makeJsonWebToken(existUser._id)
    res.status(200).json({ user: existUser, token: token })
})

router.get('/', async (req, res) => {
    const token = req.headers.authorization
    const nimadir = getJsonWebToken(token)
    const userId = nimadir.payload.userId
    const user = await User.findById(userId)
    res.status(200).json({ user })
})

export default router