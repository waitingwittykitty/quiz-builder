import instance from './instance';
import { Quiz, QuizQuery } from '../context/quiz-context';

class QuizService {
  getQuizCount() {
    return instance.get('/quizzes/count');
  }
  getQuizzes(query: QuizQuery) {
    return instance.get('/quizzes', { params: query });
  }
  publishQuiz(quiz: Quiz) {
    return instance.patch(`/quizzes/${quiz._id}/publish`);
  }
  deleteQuiz(quiz: Quiz) {
    return instance.delete(`/quizzes/${quiz._id}`);
  }
}

export default new QuizService();
