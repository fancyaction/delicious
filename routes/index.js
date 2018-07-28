const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');

const { catchErrors } = require('../handlers/errorHandlers');

// === STORE ROUTES ===
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/add', storeController.addStore);
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

// user updates via store form
router.post(
  '/add/:id',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore)
);
// user creates via store form
router.post(
  '/add',
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);

// === USER ROUTES ===

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

// 1. Validate registration data
// 2. Register user
// 3. Log-in user
router.post('/register', userController.validateRegister);

module.exports = router;
