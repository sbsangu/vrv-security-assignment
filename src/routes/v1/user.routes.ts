import { Router, Request, Response } from 'express';
import { UserController } from '../../controllers/user.controller';
import authMiddleware from '../../middleware/auth.middleware';

const router = Router();
const userController = new UserController();




// GET /: Fetching all users by the admin and moderator
router.get(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorize('read', "users", ["ADMIN","MODERATOR"]),
  userController.getAllUsers
);


//   Route: GET /profile
//  Description: Fetch a specific user's profile by token(Accessible to authenticated users)
 
router.get(
  '/profile',
  authMiddleware.authenticate,
  userController.getUserProfile
);



//  Route: PUT /profile
//  Description: Update the authenticated user's profile (Accessible to USER)
 
router.put(
  '/profile',
  authMiddleware.authenticate,
  authMiddleware.authorize('update',"profile",["USER"]),
  userController.updateUserProfile
);

// DELETE /:id - Delete a user by the admin
router.delete(
  '/:id',
  authMiddleware.authenticate, // Ensure the user is authenticated
  authMiddleware.authorize('delete', 'users', ['ADMIN']), // Ensure only admins can delete users
  userController.deleteUser
);

export default router;