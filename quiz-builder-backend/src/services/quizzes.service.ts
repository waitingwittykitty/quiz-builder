import { CreateQuizDto, UpdateQuizDto } from '@dtos/quizzes.dto';
import { HttpException } from '@exceptions/HttpException';
import {
  Quiz,
  PublicQuiz,
  Answer,
  Question,
  CheckResult,
} from '@interfaces/quizzes.interface';
import quizModel from '@models/quizzes.model';
import { createPermalink, isEmpty } from '@utils/util';

class QuizService {
  public quizzes = quizModel;

  public async findAllQuizByAuthor(
    author: string,
    query: { page: number; perPage: number },
  ): Promise<Quiz[]> {
    const { page, perPage } = query;

    if (isEmpty(author)) {
      throw new HttpException(400, 'Author is empty');
    }

    if (page < 1) {
      throw new HttpException(400, 'Page should be a positive integer');
    }

    if (perPage < 1 || perPage > 100) {
      throw new HttpException(400, 'PerPage should be in range of 1 - 100');
    }

    const quizzes: Quiz[] = await this.quizzes
      .find({ author })
      .sort('-_id')
      .limit(perPage)
      .skip((page - 1) * perPage);
    return quizzes;
  }

  public async getQuizTotalCountByAuthor(author: string) {
    if (isEmpty(author)) {
      throw new HttpException(400, 'Author is empty');
    }

    const quizCount: number = await this.quizzes.countDocuments({ author });
    return quizCount;
  }

  public async findQuizByIdAndAuthor(quizId: string, author: string): Promise<Quiz> {
    if (isEmpty(quizId)) {
      throw new HttpException(400, 'QuizId is empty');
    }
    if (isEmpty(author)) {
      throw new HttpException(400, 'Author is empty');
    }

    const foundQuiz: Quiz = await this.quizzes.findOne({ _id: quizId, author });
    if (!foundQuiz) throw new HttpException(404, "Quiz doesn't exist");

    return foundQuiz;
  }

  public async findQuizByPermalink(permalink: string): Promise<PublicQuiz> {
    if (isEmpty(permalink)) {
      throw new HttpException(400, 'Permalink is empty');
    }

    const foundQuiz: Quiz = await this.quizzes.findOne({ permalink });
    if (!foundQuiz) {
      throw new HttpException(404, "Quiz doesn't exist");
    }

    return foundQuiz.getPublicData();
  }

  public async createQuiz(quizData: CreateQuizDto, author: string): Promise<Quiz> {
    if (isEmpty(quizData)) {
      throw new HttpException(400, 'QuizData is empty');
    }
    if (isEmpty(author)) {
      throw new HttpException(400, 'Author is empty');
    }

    const createdQuiz: Quiz = await this.quizzes.create({
      ...quizData,
      author,
    });

    return createdQuiz;
  }

  public async updateQuiz(
    quizId: string,
    quizData: UpdateQuizDto,
    author: string,
  ): Promise<Quiz> {
    if (isEmpty(quizId)) {
      throw new HttpException(400, 'QuizId is empty');
    }
    if (isEmpty(quizData)) {
      throw new HttpException(400, 'QuizData is empty');
    }
    if (isEmpty(author)) {
      throw new HttpException(400, 'Author is empty');
    }

    const updatedQuiz: Quiz = await this.quizzes.findOneAndUpdate(
      {
        _id: quizId,
        author,
        permalink: null,
      },
      quizData,
    );

    if (!updatedQuiz) {
      throw new HttpException(404, "Quiz doesn't exist");
    }

    return updatedQuiz;
  }

  public async publishQuiz(quizId: string, author: string): Promise<Quiz> {
    if (isEmpty(quizId)) {
      throw new HttpException(400, 'QuizId is empty');
    }
    if (isEmpty(author)) {
      throw new HttpException(400, 'Author is empty');
    }

    const publishedQuiz: Quiz = await this.quizzes.findOneAndUpdate(
      {
        _id: quizId,
        author,
      },
      { permalink: createPermalink() },
    );

    if (!publishedQuiz) {
      throw new HttpException(404, "Quiz doesn't exist");
    }

    return publishedQuiz;
  }

  public async deleteQuiz(quizId: string, author: string): Promise<Quiz> {
    if (isEmpty(quizId)) {
      throw new HttpException(400, 'QuizId is empty');
    }
    if (isEmpty(author)) {
      throw new HttpException(400, 'Author is empty');
    }

    const deletedQuiz: Quiz = await this.quizzes.findOneAndDelete({
      _id: quizId,
      author,
    });
    if (!deletedQuiz) {
      throw new HttpException(404, "Quiz doesn't exist");
    }

    return deletedQuiz;
  }

  private isCorrectAnswer(question: Question, answer: Answer): Boolean {
    if (question.type === 'single') {
      const submittedAnswer = answer as number;

      return submittedAnswer === question.correctAnswer;
    } else if (question.type === 'multiple') {
      const submittedAnswer = answer as number[];
      const correctAnswer = question.correctAnswer as number[];

      if (submittedAnswer?.length !== correctAnswer?.length) {
        return false;
      }

      submittedAnswer.sort();
      correctAnswer.sort();

      return submittedAnswer.every((submittedOne, index) => {
        return submittedOne === correctAnswer[index];
      });
    }
  }

  public async checkAnswerByPermalink(
    permalink: string,
    answers: Answer[],
  ): Promise<CheckResult> {
    if (isEmpty(permalink)) {
      throw new HttpException(400, 'Permalink is empty');
    }

    const foundQuiz: Quiz = await this.quizzes.findOne({ permalink });
    if (!foundQuiz) {
      throw new HttpException(404, "Quiz doesn't exist");
    }

    const score = foundQuiz.questions.reduce((score, question, index) => {
      return score + Number(this.isCorrectAnswer(question, answers[index]));
    }, 0);

    return { total: foundQuiz.questions?.length, score };
  }
}

export default QuizService;
