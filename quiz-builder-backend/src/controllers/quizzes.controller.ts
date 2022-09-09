import { NextFunction, Request, Response } from 'express';
import { CreateQuizDto, UpdateQuizDto } from '@dtos/quizzes.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { Answer, PublicQuiz, Quiz } from '@interfaces/quizzes.interface';
import quizService from '@services/quizzes.service';

class QuizzesController {
  public quizService = new quizService();

  public getQuizzes = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { page, perPage } = req.query;
      const findAllQuizzesData: Quiz[] = await this.quizService.findAllQuizByAuthor(
        req.user._id.toString(),
        { page: Number(page), perPage: Number(perPage) },
      );

      res.status(200).json({ data: findAllQuizzesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getQuizCount = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const totalCount: number = await this.quizService.getQuizTotalCountByAuthor(
        req.user._id.toString(),
      );

      res.status(200).json({ data: totalCount, message: 'getTotalCount' });
    } catch (error) {
      next(error);
    }
  };

  public getQuizById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quizId: string = req.params.id;
      const userId: string = req.user._id.toString();
      const foundQuiz: Quiz = await this.quizService.findQuizByIdAndAuthor(
        quizId,
        userId,
      );

      res.status(200).json({ data: foundQuiz, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createQuiz = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const quizData: CreateQuizDto = req.body;
      const userId: string = req.user._id.toString();
      const createdQuiz: Quiz = await this.quizService.createQuiz(quizData, userId);

      res.status(201).json({ data: createdQuiz, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateQuiz = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const quizData: UpdateQuizDto = req.body;
      const quizId: string = req.params.id;
      const userId: string = req.user._id.toString();
      const updatedQuiz: Quiz = await this.quizService.updateQuiz(
        quizId,
        quizData,
        userId,
      );

      res.status(201).json({ data: updatedQuiz, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public publishQuiz = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const quizId: string = req.params.id;
      const userId: string = req.user._id.toString();
      const publishedQuiz: Quiz = await this.quizService.publishQuiz(quizId, userId);

      res.status(200).json({ data: publishedQuiz, message: 'published' });
    } catch (error) {
      next(error);
    }
  };

  public deleteQuiz = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const quizId: string = req.params.id;
      const userId: string = req.user._id.toString();
      const deletedQuiz: Quiz = await this.quizService.deleteQuiz(quizId, userId);

      res.status(200).json({ data: deletedQuiz, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public getQuizByPermalink = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permalink: string = req.params.permalink;
      const foundQuiz: PublicQuiz = await this.quizService.findQuizByPermalink(permalink);

      res.status(200).json({ data: foundQuiz, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public checkAnswerByPermalink = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const permalink: string = req.params.permalink;
      const answer: Answer[] = req.body?.answer;
      const checkResult = await this.quizService.checkAnswerByPermalink(
        permalink,
        answer,
      );

      res.status(200).json({ data: checkResult, message: 'checked' });
    } catch (error) {
      next(error);
    }
  };
}

export default QuizzesController;
