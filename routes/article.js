import { Router } from "express";
import Post from "../modules/article.js";
import multer from "multer";
import { fileURLToPath } from "url"
import path, { dirname } from "path";
import fs from "fs"
import { getJsonWebToken } from "../jwt/token.js";
const router = Router()


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

router.get('/', async (req, res) => {
    const articles = await Post.find().lean()
    res.status(200).json(articles)
})

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads')
    },
    filename: function (req, file, callback) {
        callback(null, `image-${Date.now()}-${file.originalname}`)
    }
})


const upload = multer({ storage })


// const convert = (file) => {
//     return new Promise((resolve, reject) => {
//         const fr = new FileReader()

//         fr.readAsDataURL(file)

//         fr.onload = () => {
//             resolve(fr.result)
//         }

//         fr.onerror = (error) => {
//             reject(error)
//         }
//     })
// }

router.post('/add', upload.single('image'), async (req, res) => {
    const user = getJsonWebToken(req.headers.authorization).payload.userId



    // const post = {
    //     title: title,
    //     body: body,
    //     src: filepath,
    //     user: user,
    // }

    // fs.readFile(req.file.path, (err, data) => {
    //     if (err) {
    //         return new Error(err)
    //     }

    //     res.send({ img: data.toString('base64')})
    // })

    res.send(req.file.path)


    // await Post.create(post)
    // res.status(200).json({ message: 'Success' })
})



export default router