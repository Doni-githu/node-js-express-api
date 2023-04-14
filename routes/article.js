import { Router } from "express";
import Post from "../modules/article.js";
import multer from "multer";
import { fileURLToPath } from "url"
import path, { dirname } from "path";
import User from "../modules/auth.js"
import { getJsonWebToken } from "../jwt/token.js";
import { unlink } from "fs";
const router = Router()


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

router.get('/', async (req, res) => {
    const articles = await Post.find().populate('user').lean()
    res.status(200).json(articles.reverse())
})

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
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
        src: `http://localhost:2000/routes/uploads/${file}`
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
    const whatDelete = await Post.findById(id)
    console.log(whatDelete.src);
    unlink(path.join(__dirname, 'uploads', ))
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

router.put('/edit/:id', upload.single('image'), async (req, res) => {
    console.log(req.body);
    console.log(req.files);
})

export default router