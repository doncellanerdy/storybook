const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
//const { findById } = require('../models/Story')

const Story = require('../models/Story')

//show add page
// GET /stories/add
router.get('/add', ensureAuth, (req, res) =>{
    res.render('stories/add')
})

//show all stories
// GET /stories
router.get('/', ensureAuth, async (req, res) =>{
    try {
        const stories = await Story.find({ status: 'public' })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()

        res.render('stories/index', { 
            stories,
            helper: require('../helpers/hbs'),
        })
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})

//show sinlge story
// GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) =>{
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()

        if(!story){
            return res.render('error/404')
        }

        res.render('stories/show', {
            story,
            helper: require('../helpers/hbs'),
        })
    } catch (error) {
        console.log(error)
        res.render('error/404')
    }
})

//edit story
// GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) =>{
    try {
        const story = await Story.findOne({ _id: req.params.id }).lean()

        if(!story){
            return res.render('error/404')
        }
    
        if(story.user != req.user.id){
            res.redirect('/stories')
    
        }else{
            res.render('stories/edit', {
                story,
                helper: require('../helpers/hbs'),
            })
        }
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }

})

//process the add form
//POST /stories/
router.post('/', ensureAuth, async (req, res) =>{
    try {
        //req.body.user = req.user.id //this is giving the session id probably becuase it is matching the closes that resembles _id 
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})

//show update story
// GET /stories/:id
router.put('/:id', ensureAuth, async (req, res) =>{
    try{
        let story = await Story.findById(req.params.id).lean()
        if(!story){
            return res.render('error/404')
        }

        if(story.user != req.user.id){
            res.redirect('/stories')

        }else{
            story = await Story.findOneAndUpdate({ _id: req.params.id}, request.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (error) {
        console.log(error)
        return res.render('error/500')
    }
})

//delete storie
// DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) =>{
    try {
        await Story.deleteOne({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        return res.render('error/500')
    }
})


//user stories
// GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) =>{
    try {
        console.log(req.params)
        const stories = await Story.find({ 
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index', {
            stories,
            helper: require('../helpers/hbs'),
        })
    } catch (error) {
        console.log(error)
        return res.render('error/500')
    }
})

module.exports = router