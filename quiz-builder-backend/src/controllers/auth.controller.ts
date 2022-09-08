import { NextFunction, Request, Response } from 'express';

import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';
import { RequestWithUser } from '@/interfaces/auth.interface';

class AuthController {
  public authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const registerUserData: User = await this.authService.register(userData);

      res.status(201).json({ data: registerUserData, message: 'register' });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { token, findUser } = await this.authService.login(userData);

      res.status(200).json({ data: { ...findUser, token }, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public getProfile = (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { token } = this.authService.createToken(req.user);

      res
        .status(200)
        .json({ data: { email: req.user.email, token }, message: 'profile' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
