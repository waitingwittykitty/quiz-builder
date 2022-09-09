import { Router } from 'express';
import QuizzesController from '@controllers/quizzes.controller';
import { CreateQuizDto, UpdateQuizDto } from '@dtos/quizzes.dto';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';

class QuizzesRoute implements Routes {
  public path = '/quizzes';
  public router = Router();
  public quizzesController = new QuizzesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(this.path)
      .all(authMiddleware)
      .get(this.quizzesController.getQuizzes)
      .post(
        validationMiddleware(CreateQuizDto, 'body'),
        this.quizzesController.createQuiz,
      );

    this.router.get(
      `${this.path}/count`,
      authMiddleware,
      this.quizzesController.getQuizCount,
    );

    this.router
      .route(`${this.path}/public/:permalink`)
      .get(this.quizzesController.getQuizByPermalink)
      .post(this.quizzesController.checkAnswerByPermalink);

    this.router
      .route(`${this.path}/:id`)
      .all(authMiddleware)
      .get(this.quizzesController.getQuizById)
      .put(validationMiddleware(UpdateQuizDto, 'body'), this.quizzesController.updateQuiz)
      .delete(this.quizzesController.deleteQuiz);

    this.router.patch(
      `${this.path}/:id/publish`,
      authMiddleware,
      this.quizzesController.publishQuiz,
    );
  }
}

export default QuizzesRoute;
