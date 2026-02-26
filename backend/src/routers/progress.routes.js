import express from 'express';
import { Protect } from '../middlewares/authMiddleware.js';
import Progress from '../models/progressSchema.js';

const router = express.Router();

// Get progress for user
router.get('/', Protect, async (req, res) => {
    try {
        let progress = await Progress.findOne({ user: req.user._id });
        
        if (!progress) {
            progress = await Progress.create({ 
                user: req.user._id,
                weightLogs: [],
                progressPhotos: []
            });
        }
        
        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update progress
router.put('/', Protect, async (req, res) => {
    try {
        const progress = await Progress.findOneAndUpdate(
            { user: req.user._id },
            req.body,
            { new: true, upsert: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add weight log
router.post('/weight', Protect, async (req, res) => {
    try {
        const progress = await Progress.findOne({ user: req.user._id });
        
        if (!progress) {
            const newProgress = await Progress.create({
                user: req.user._id,
                weightLogs: [{ ...req.body, date: new Date() }]
            });
            return res.status(201).json({
                success: true,
                data: newProgress
            });
        }
        
        // Calculate change from previous weight
        const lastWeight = progress.weightLogs[progress.weightLogs.length - 1]?.weight;
        const change = lastWeight ? req.body.weight - lastWeight : 0;
        
        progress.weightLogs.push({ 
            ...req.body, 
            date: new Date(),
            change 
        });
        
        await progress.save();
        
        res.status(201).json({
            success: true,
            data: progress.weightLogs[progress.weightLogs.length - 1]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update measurements
router.put('/measurements', Protect, async (req, res) => {
    try {
        const progress = await Progress.findOneAndUpdate(
            { user: req.user._id },
            { measurements: req.body },
            { new: true, upsert: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            data: progress.measurements
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update goal
router.put('/goal', Protect, async (req, res) => {
    try {
        const progress = await Progress.findOneAndUpdate(
            { user: req.user._id },
            { goal: req.body },
            { new: true, upsert: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            data: progress.goal
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update adherence
router.put('/adherence', Protect, async (req, res) => {
    try {
        const progress = await Progress.findOneAndUpdate(
            { user: req.user._id },
            { adherence: req.body },
            { new: true, upsert: true, runValidators: true }
        );
        
        res.status(200).json({
            success: true,
            data: progress.adherence
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;