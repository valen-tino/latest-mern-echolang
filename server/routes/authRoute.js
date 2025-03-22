import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        if(!req.body.email || !req.body.password){
            return res.status(400).json({ message: 'Please fill in all of the required fields.' });
        }

        if(!validator.isEmail(req.body.email)){
            return res.status(400).json({ message: 'Email is not valid.' });
        }

        const checkEmail = await User.findOne({ email: req.body.email });
        if(checkEmail){
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            ...req.body,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User has been created.', user });
    } catch(error){
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for: ' + email);

        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({ message: 'User is not found!' });
        }

        const isPassMatch = await bcrypt.compare(password, user.password);
        if(!isPassMatch){
            return res.status(401).json({ message: 'Password is not valid!' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch(error){
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error!'});
    }
});

router.get('/current', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found!'});
        }
        res.json(user);
    } catch(error){
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error!'});
    }
});

router.get('/role', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if(!user){
            return res.status(404).json({ message: 'User not found!'});
        }
        
        if(user.role === 'admin'){
            return res.status(200).json({ message: 'You are currently logged in as Administrator.' });
        } else {
            return res.status(200).json({ message: 'You are currently logged in as User.' });
        }
    } catch(error){
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error!'});
    }
});

export default router;