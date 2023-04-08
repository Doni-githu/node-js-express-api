import User from "../modules/auth.js";
import { Router } from "express";
import bcrypt from "bcrypt"
import { makeJsonWebToken } from "../jwt/token.js"

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
    res.status(200).json({ user: user, token })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body.user
    const existUser = User.findOne({ email })
    if (!existUser) {
        res.status(400).json({ message: "User not found" })
        return
    }

    const CheckPassword = await bcrypt.compare(existUser.password, password)
    if (!CheckPassword) {
        res.status(400).json({ message: "Password is wrong" })
        return
    }

    const token = makeJsonWebToken(existUser._id)
    res.status(200).json({ user: existUser, token: token })
})

export default router