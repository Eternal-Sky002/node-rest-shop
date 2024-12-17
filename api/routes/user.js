const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    User
    .find({ email: req.body.email})
    .exec()
    .then(user => {
        // Cek apabila email sudah terdaftar
        if(user.length >=1){
            return res.status(409).json({
                message: "Email exists"
            });
        } else {
            // Hash password yang akan disimpan ke database
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        message: err.message
                    });
                } else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Handling POST requests to /user',
                            createdUser: {
                                _id: result._id,
                                email: result.email,
                                password: hash,
                                request: {
                                    type: "GET",
                                    url: "http://localhost:3000/user/" + result._id
                                }
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err.message
                        });
                    })
                }
            });
        }
    })
});

router.post('/login', (req, res, next) => {
    User
    .find({ email: req.body.email})
    .exec()
    .then(user => {
        if(user.length <1){
            return res.status(401).json({
                message: 'Auth Failed'
            });
        }
        // Membaca isi hash password di database dengan password di body
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            if(result){
                // Generate JWT
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    }, 
                    process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth Failed'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({
        _id: id
    })
    .exec()
    .then(res.status(200).json({
        message: 'Deleted User!',
        request: {
            type: 'POST',
            url: "http://localhost:3000/user",
            body: { userId: 'ID', email: 'String'}
            }
        })
    )
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;