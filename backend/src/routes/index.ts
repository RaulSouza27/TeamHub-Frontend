import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { AdmissionController } from '../controllers/admissionController';
import { OnboardingController } from '../controllers/onboardingController';
import { CommunicationController } from '../controllers/communicationController';
import { authMiddleware, roleMiddleware } from '../middlewares/auth';

const router = Router();

// Controllers
const authController = new AuthController();
const admissionController = new AdmissionController();
const onboardingController = new OnboardingController();
const communicationController = new CommunicationController();

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware, authController.me);

// Admission Routes
router.post('/admissions', authMiddleware, admissionController.create);
router.get('/admissions', authMiddleware, admissionController.list);
router.get('/admissions/:id', authMiddleware, admissionController.show);
router.post('/admissions/documents/upload', authMiddleware, admissionController.uploadDocument);
router.patch(
  '/admissions/documents/:id/approve',
  authMiddleware,
  roleMiddleware('RH', 'GESTOR'),
  admissionController.approveDocument
);

// Onboarding Routes
router.post('/onboarding', authMiddleware, onboardingController.create);
router.get('/onboarding', authMiddleware, onboardingController.list);
router.get('/onboarding/:id', authMiddleware, onboardingController.show);
router.patch('/onboarding/:id/progress', authMiddleware, onboardingController.updateProgress);

// Communication Routes - Posts
router.post('/posts', authMiddleware, communicationController.createPost);
router.get('/posts', authMiddleware, communicationController.listPosts);
router.post('/posts/:id/like', authMiddleware, communicationController.likePost);
router.post('/posts/:id/comments', authMiddleware, communicationController.createComment);

// Communication Routes - Messages
router.post('/messages', authMiddleware, communicationController.sendMessage);
router.get('/messages/:userId', authMiddleware, communicationController.getMessages);
router.get('/conversations', authMiddleware, communicationController.getConversations);

export default router;
