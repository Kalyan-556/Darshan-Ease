const express = require('express');
const templeController = require('../controllers/templeController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', templeController.getTemples);
router.get('/:id', templeController.getTempleById);

// Admin only routes for managing temples
router.post(
  '/', 
  verifyToken, 
  authorizeRoles('ADMIN'), 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 5 }
  ]), 
  templeController.createTemple
);

router.put(
  '/:id', 
  verifyToken, 
  authorizeRoles('ADMIN'), 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 5 }
  ]), 
  templeController.updateTemple
);

router.delete('/:id', verifyToken, authorizeRoles('ADMIN'), templeController.deleteTemple);

module.exports = router;
