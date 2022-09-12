import instance from './instance';
import { Answer, Quiz, QuizQuery } from '../context/quiz-context';
import { QuizFormValues } from '../components/quiz-form/quiz-form';

class QuizService {
  getQuizCount() {
    return instance.get('/quizzes/count');
  }
  getQuizzes(query: QuizQuery) {
    return instance.get('/quizzes', { params: query });
  }
  getQuizById(quizId: string) {
    return instance.get(`/quizzes/${quizId}`);
  }
  addQuiz(data: QuizFormValues) {
    return instance.post('/quizzes', data);
  }
  publishQuiz(quiz: Quiz) {
    return instance.patch(`/quizzes/${quiz._id}/publish`);
  }
  updateQuiz(quiz: Quiz, data: QuizFormValues) {
    return instance.put(`/quizzes/${quiz._id}`, data);
  }
  getQuizByPermalink(permalink: string) {
    return instance.get(`/quizzes/public/${permalink}`);
  }
  checkAnswer(permalink: string, data: { answer: Answer[] }) {
    return instance.post(`/quizzes/public/${permalink}`, data);
  }
  deleteQuiz(quiz: Quiz) {
    return instance.delete(`/quizzes/${quiz._id}`);
  }
}

export default new QuizService();
