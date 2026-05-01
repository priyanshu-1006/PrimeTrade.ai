import { Router } from 'express';
import { signalController } from './signal.controller';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { requireAdmin } from '../../middleware/rbac';
import { createSignalSchema, updateSignalSchema } from './signal.schema';

const router = Router();

/**
 * @route   GET /api/v1/signals
 * @desc    Get all trade signals (paginated)
 * @access  Private
 */
router.get('/', authenticate, signalController.findAll.bind(signalController));

/**
 * @route   GET /api/v1/signals/:id
 * @desc    Get a single trade signal
 * @access  Private
 */
router.get('/:id', authenticate, signalController.findById.bind(signalController));

/**
 * @route   POST /api/v1/signals
 * @desc    Create a new trade signal
 * @access  Admin only
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(createSignalSchema),
  signalController.create.bind(signalController)
);

/**
 * @route   PATCH /api/v1/signals/:id
 * @desc    Update a trade signal
 * @access  Admin only
 */
router.patch(
  '/:id',
  authenticate,
  requireAdmin,
  validate(updateSignalSchema),
  signalController.update.bind(signalController)
);

/**
 * @route   DELETE /api/v1/signals/:id
 * @desc    Delete a trade signal
 * @access  Admin only
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  signalController.delete.bind(signalController)
);

export default router;
