import express from "express";
import Feedback from "../models/Feedback.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user._id;
        const { feedback_description, rating } = req.body;

        if(!feedback_description || !rating){
            return res.status(400).json({ message: 'Please fill in all of the required fields.' });
        }

        const newFeedback = new Feedback({
            user_id,
            feedback_description,
            rating
        });
        await newFeedback.save();
        res.status(200).json({
            message: "Successfully submitted the feedback.",
            feedback: newFeedback
        });
    } catch(error){
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
});

// Get all feedbacks for the administrator section
router.get('/all', authMiddleware, async (req, res) => {
    try {   
        const user = await User.findById(req.user._id);
        if(!user || user.role !== 'admin'){
            return res.status(403).json({ message: 'Access denied.' });
        }

        const listFeedback = await Feedback.find().populate("user_id feedback_description");
        res.json({ feedback: listFeedback });
    } catch(error){
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
});

router.get('/', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user._id;
        const feedbackList = await Feedback.find({ user_id });
        res.json({ feedback: feedbackList });
    } catch(error){
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
});

router.put('/update/:id', authMiddleware, async (req, res) => {
    try {
        const user_id = req.user._id;
        const { id } = req.params;
        const { admin_response } = req.body;

        const user = await User.findById(user_id);
        if(!user || user.role !== 'admin'){
            return res.status(403).json({ message: 'Access denied.' });
        }

        const feedback = await Feedback.findById(id);
        if(!feedback){
            return res.status(404).json({ message: 'Feedback not found.' });
        }

        feedback.admin_response = admin_response;
        feedback.status = 'reviewed';

        await feedback.save();
        res.status(200).json({ message: "Feedback updated successfully.", feedback });
    } catch(error){
        console.error('Error: ', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
})

export default router;