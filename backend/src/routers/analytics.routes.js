import express from 'express';
import { Protect } from '../middlewares/authMiddleware.js';
import Analytics from '../models/analyticsSchema.js';

const router = express.Router();

// Get analytics for user
router.get('/', Protect, async (req, res) => {
    try {
        const analytics = await Analytics.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single analytics record
router.get('/:id', Protect, async (req, res) => {
    try {
        const analytics = await Analytics.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: 'Analytics record not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create analytics
router.post('/', Protect, async (req, res) => {
    try {
        const analyticsData = { ...req.body, user: req.user._id };
        const analytics = await Analytics.create(analyticsData);
        
        res.status(201).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update analytics
router.put('/:id', Protect, async (req, res) => {
    try {
        const analytics = await Analytics.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: 'Analytics record not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete analytics
router.delete('/:id', Protect, async (req, res) => {
    try {
        const analytics = await Analytics.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!analytics) {
            return res.status(404).json({
                success: false,
                message: 'Analytics record not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Analytics record deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;