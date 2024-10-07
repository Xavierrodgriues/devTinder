const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Forgot Password Route
router.post('/profile/forgotPassword', async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
