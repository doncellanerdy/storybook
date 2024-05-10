const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')

//landing page
// GET /
router.get('/', ensureGuest, (req, res) =>{
    res.render('login', {
        layout: 'login',
    })
})

//dashboard
// GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) =>{
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        console.log(req.user, req.user.id)
        res.render('dashboard.ejs', {
            name: req.user.firstName,
            stories,
            helper: require('../helpers/hbs')
        })
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
   
})


module.exports = router