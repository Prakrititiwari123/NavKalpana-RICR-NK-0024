import express from 'express';
import { Protect } from '../middlewares/authMiddleware.js';
import WorkoutLog from '../models/workoutSchema.js';

const router = express.Router();

// Get all workouts for user
router.get('/', Protect, async (req, res) => {
    try { 
        
        console.log("hi");
    
        const workouts = await WorkoutLog.find({ user: req.user._id })
            .sort({ date: -1 });
        res.status(200).json({
            success: true,
            data: workouts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single workout
router.get('/:id', Protect, async (req, res) => {
    try {
        const workout = await WorkoutLog.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: workout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create workout
router.post('/', Protect, async (req, res) => {
    try {
        const workoutData = { ...req.body, user: req.user._id };
        const workout = await WorkoutLog.create(workoutData);
        
        res.status(201).json({
            success: true,
            data: workout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update workout
router.put('/:id', Protect, async (req, res) => {
    try {
        const workout = await WorkoutLog.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: workout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete workout
router.delete('/:id', Protect, async (req, res) => {
    try {
        const workout = await WorkoutLog.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Workout deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;