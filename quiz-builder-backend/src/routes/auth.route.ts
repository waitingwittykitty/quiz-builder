import { Router } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}register`,
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.register,
    );
    this.router.post(
      `${this.path}login`,
      validationMiddleware(CreateUserDto, 'body'),
      this.authController.login,
    );
    this.router.get(
      `${this.path}profile`,
      authMiddleware,
      this.authController.getProfile,
    );
  }
}

export default AuthRoute;
