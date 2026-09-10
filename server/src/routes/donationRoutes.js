import express from 'express';
import {
  createDonation,
  getDonations,
  getDonationById,
  claimDonation,
  updateDonationStatus,
  getMyDonations,
  getMyClaims,
  getPlatformStats,
  getRescueTimeline,
} from '../controllers/donationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public stats and listing
router.get('/stats', getPlatformStats);
router.get('/my-donations', protect, getMyDonations);
router.get('/my-claims', protect, getMyClaims);

router.route('/')
  .get(getDonations)
  .post(protect, createDonation);

router.route('/:id')
  .get(getDonationById);

router.get('/:id/timeline', protect, getRescueTimeline);
router.patch('/:id/claim', protect, claimDonation);
router.patch('/:id/status', protect, updateDonationStatus);

export default router;

