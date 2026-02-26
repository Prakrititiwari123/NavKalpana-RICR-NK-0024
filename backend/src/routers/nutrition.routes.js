import express from 'express';
import { Protect } from '../middlewares/authMiddleware.js';
import NutritionLog from '../models/nutritionSchema.js';

const router = express.Router();

// Get all nutrition logs
router.get('/', Protect, async (req, res) => {
    try {
        const nutritionLogs = await NutritionLog.find({ user: req.user._id })
            .sort({ date: -1 });
        res.status(200).json({
            success: true,
            data: nutritionLogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single nutrition log
router.get('/:id', Protect, async (req, res) => {
    try {
        const nutritionLog = await NutritionLog.findOne({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!nutritionLog) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition log not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: nutritionLog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create nutrition log
router.post('/', Protect, async (req, res) => {
    try {
        const nutritionData = { ...req.body, user: req.user._id };
        const nutritionLog = await NutritionLog.create(nutritionData);
        
        res.status(201).json({
            success: true,
            data: nutritionLog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update nutrition log
router.put('/:id', Protect, async (req, res) => {
    try {
        const nutritionLog = await NutritionLog.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!nutritionLog) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition log not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: nutritionLog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete nutrition log
router.delete('/:id', Protect, async (req, res) => {
    try {
        const nutritionLog = await NutritionLog.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user._id 
        });
        
        if (!nutritionLog) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition log not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Nutrition log deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;