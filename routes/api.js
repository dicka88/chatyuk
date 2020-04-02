const express = require('express')
const router = express.Router()
const path = require('path')
const { pool, get_messages } = require('../config/database')

router.get('/getcomment', async(req, res) => {
    const pagination = req.query.pagination
    const allComment = await get_messages(pagination || 0)

    res.json(allComment)
})

module.exports = router