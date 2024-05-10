const express = require('express')
const passport = require('passport')
const config = require('../config/config')
const router = express.Router()

//auth google
// GET /auth/google
router.get('/google', passport.authenticate(['google'], { scope: ['profile']}))

//google auth callback
// GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard')
})

//google logout user
// GET /auth/logout
router.get('/logout', (req, res, next) => {
  req.logOut(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  })
})

//Microsoft ROUTES

router.get('/login',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect', 
      { 
        response: res,                      
        resourceURL: config.resourceURL,    
        customState: 'my_state',            
        failureRedirect: '/' 
      }
    )(req, res, next);
  },
  function(req, res) {
    console.log('Login was called in the Sample');
    res.redirect('/dashboard');
});

router.get('/openid/return',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect', 
      { 
        response: res,    
        failureRedirect: '/'  
      }
    )(req, res, next);
  },
  function(req, res) {
    console.log('We received a return from AzureAD.');
    res.redirect('/dashboard');
  });

router.post('/openid/return',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect', 
      { 
        response: res,    
        failureRedirect: '/'  
      }
    )(req, res, next);
  },
  function(req, res) {
    console.log('We received a return from AzureAD.');
    res.redirect('/dashboard');
  });


// router.get('/logout', function(req, res, next){
//   req.session.destroy(function(err) {
//     req.logOut(function(err) {
//       if (err) { return next(err); }
//       res.redirect(config.destroySessionUrl);
//     });
    
//   });
// });

module.exports = router