const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const User = require('./models/user.module');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name)
    console.log(email)
    console.log(password)
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).send('You must be logged in to view this resource');
    }
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).send('Invalid email or password');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send('Invalid email or password');
        const token = jwt.sign({ email: user.email }, secretKey);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
