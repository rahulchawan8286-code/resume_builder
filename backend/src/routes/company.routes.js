const express = require('express');
const router = express.Router();
const c = require('../controllers/company.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, c.getAllCompanies);
router.get('/bookmarks', authenticate, c.getUserBookmarks);
router.get('/targets', authenticate, c.getUserTargets);
router.get('/:id', authenticate, c.getCompanyById);

router.post('/:id/bookmark', authenticate, c.bookmarkCompany);
router.delete('/:id/bookmark', authenticate, c.removeBookmark);

router.post('/:id/target', authenticate, c.addTargetCompany);
router.delete('/:id/target', authenticate, c.removeTargetCompany);

module.exports = router;
