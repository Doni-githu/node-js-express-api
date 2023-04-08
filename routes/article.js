import { Router } from "express";
import Article from "../modules/article.js";

const router = Router()

router.get('/', async (req, res) => {
    const articles = await Article.find().lean()
    res.status(200).send(articles)
})



export default router