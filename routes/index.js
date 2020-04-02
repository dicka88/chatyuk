const express = require('express');
const router = express.Router();
const axios = require('axios')
const { insert_user } = require('../config/database')
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env

/* GET home page. */
router.get('/', (req, res, next) => {
    if (req.session.logged) {
        const { user_id, login, avatar_url, github, name, email, bio } = req.session.login
        
        res.render('chatting', {
            title: 'ChatYuk',
            user: {
                user_id,
                login,
                avatar_url: avatar_url || 'images/icons/favicon.ico',
                github,
                name,
                email,
                bio
            }
        })
    } else {
        req.session.logged = false
        res.render('index', { title: 'Login Chatyuk' })
    }
});

router.post('/auth/login', async (req, res) => {
    const username = req.body.username
    req.session.logged = true

    const random_avatar = [
        'https://avatars1.githubusercontent.com/u/399843?v=4',
        'https://avatars2.githubusercontent.com/u/2814544?v=4',
        'https://avatars2.githubusercontent.com/u/17730516?v=4',
        'https://avatars2.githubusercontent.com/u/17486153?v=4',
        'https://avatars3.githubusercontent.com/u/49432073?s=128&v=4',
        'https://avatars1.githubusercontent.com/u/1833193?v=4',
        'https://avatars0.githubusercontent.com/u/7541840?s=128&v=4',
        'https://avatars2.githubusercontent.com/u/3909144?s=128&v=4',
        'https://avatars1.githubusercontent.com/u/5821883?s=128&v=4',
        'https://avatars2.githubusercontent.com/u/469092?s=128&v=4',
        'https://avatars3.githubusercontent.com/u/57726025?s=128&v=4',
        'https://avatars1.githubusercontent.com/u/28494085?s=128&v=4',
        'https://avatars0.githubusercontent.com/u/13144493?s=128&v=4',
        'https://avatars2.githubusercontent.com/u/50067556?s=128&v=4',
        'https://avatars2.githubusercontent.com/u/39665717?s=128&v=4',
        'https://avatars3.githubusercontent.com/u/9257870?s=128&v=4',
        'https://avatars2.githubusercontent.com/u/12031248?s=128&v=4',
        'https://avatars0.githubusercontent.com/u/60290654?s=128&v=4',
        'https://avatars1.githubusercontent.com/u/26218312?s=128&v=4',
        'https://avatars2.githubusercontent.com/u/447371?s=128&v=4',
        'https://avatars2.githubusercontent.com/u/9144098?s=128&v=4',
        'https://avatars3.githubusercontent.com/u/54067418?s=128&v=4',
        'https://avatars3.githubusercontent.com/u/52676562?s=128&v=4',
        'https://avatars3.githubusercontent.com/u/33950815?s=128&v=4',
        'https://avatars3.githubusercontent.com/u/8282510?s=128&v=4',
        'https://avatars2.githubusercontent.com/u/9956122?s=128&v=4',
        'https://avatars2.githubusercontent.com/u/54366058?s=128&v=4',
        'https://avatars3.githubusercontent.com/u/1071251?s=128&v=4',
        'https://avatars1.githubusercontent.com/u/12025699?s=120&v=4'
    ]

    const random = Math.floor(Math.random() * random_avatar.length)
    const random_image = random_avatar[random]

    req.session.login = {
        user_id: 'anoymous-' + username,
        login: username,
        name: username,
        github: false,
        email: '',
        avatar_url: random_image,
        bio: ''
    }

    const exist = insert_user(req.session.login)
    const arr = await exist

    if (arr.length) {
        req.session.login.avatar_url = arr[0].path_photo
    }

    res.redirect('/')
})

router.get('/auth/github', (req, res) => {
    const github_api = 'https://github.com/login/oauth/authorize?client_id='
    res.redirect(github_api + GITHUB_CLIENT_ID)
})

router.get('/auth/github/callback', async(req, res) => {
    const github_code = req.query.code
    const github_end = 'https://github.com/login/oauth/access_token'

    const data = {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: github_code
    }

    try {
        const request = await axios.post(github_end, data)
        let access_token = await request.data
        access_token = await access_token.split('&')[0].split('=')[1]

        const getAccount = await axios.get('https://api.github.com/user', {
            headers: {
                "Authorization": 'token ' + access_token
            }
        })

        const result = getAccount.data
        let { login, avatar_url, name, email } = result

        // set session
        req.session.logged = true
        req.session.login = {
            user_id: login,
            login,
            avatar_url,
            github: true,
            name
        }
        insert_user(req.session.login)
    } catch (e) {
        console.error(e)
    }

    res.redirect('/')
})

router.get('/user', (req, res) => {
    const name = req.session.name || req.session.login
    res.send(name)
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/')
        }
    })
})


module.exports = router;