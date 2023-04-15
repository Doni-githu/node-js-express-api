import { Router } from "express";
import Post from "../modules/article.js";
import multer from "multer";
import { fileURLToPath } from "url"
import path, { dirname } from "path";
import User from "../modules/auth.js"
import { getJsonWebToken } from "../jwt/token.js";
import { unlink } from "fs";
import { v4 } from "uuid"
const router = Router()


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

router.get('/', async (req, res) => {
    const articles = await Post.find().populate('user').lean()
    res.status(200).json(articles.reverse())
})

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '/uploads')
    },
    filename: function (req, file, callback) {
        callback(null, `image-${v4()}-${file.originalname}`)
    },
})


const upload = multer({ storage: storage })

router.post('/add', upload.single('image'), async (req, res) => {
    const user = getJsonWebToken(req.headers.authorization).payload.userId
    const file = req.file.filename
    const { title, body } = req.body
    const post = {
        title: title,
        body: body,
        user: user,
        src: `https://node-js-express-api.onrender.com/routes/uploads/${file}`
    }
    await Post.create(post)
    res.status(200).json({ message: "Success" })
})

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const product = await Post.findById(id).populate('comments.postedBy', '_id username')
    res.status(200).json({ product })
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const oldProduct = await Post.findById(id)
    const filename = oldProduct.src.replace('https://node-js-express-api.onrender.com/routes/uploads/', '')
    unlink(path.join(__dirname, 'uploads', filename), (err) => {
        if (err) {
            throw new Error(err)
        }
    })
    await Post.findByIdAndRemove(id, { new: true })
    res.status(202).json({ message: 'Successfuly deleted your post' })
})

router.put('/comment', async (req, res) => {
    const userId = getJsonWebToken(req.headers.authorization).payload.userId
    const user = await User.findById(userId)

    const comments = {
        text: req.body.text,
        postedBy: user._id
    }
    const updated = await Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comments }
    }, { new: true }).populate('comments.postedBy', '_id username')
    res.status(200).json(updated)
})

router.get('/edit/:id', async (req, res) => {
    const product = await Post.findById(req.params.id)
    res.status(200).json({ product })
})

router.put('/edit/:id', upload.single('image'), async (req, res) => {
    const existProduct = await Post.findById(req.params.id)
    const filename = existProduct.src.replace('https://node-js-express-api.onrender.com/routes/uploads/', '')
    unlink(path.join(__dirname, 'uploads', filename), (err) => {
        if (err) {
            return new Error(err)
        }
    })
    const newPost = {
        title: req.body.title,
        body: req.body.body,
        src: `https://node-js-express-api.onrender.com/routes/uploads/${req.file.filename}`,
        comments: existProduct.comments,
        user: existProduct.user,
    }
    await Post.findByIdAndUpdate(req.params.id, newPost, { new: true })
    res.status(201).json({ message: 'Successfuly updated' })
})

export default router