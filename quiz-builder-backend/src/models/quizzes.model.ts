import { model, Schema, Document } from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');
import { Quiz } from '@interfaces/quizzes.interface';
import { isArray, isPositive } from 'class-validator';

const quizSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    unique: 'Title should be unique',
  },
  permalink: {
    type: String,
    default: null,
  },
  author: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  questions: {
    type: [
      {
        question: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['single', 'multiple'],
          default: 'single',
        },
        answers: [
          {
            type: String,
            required: true,
          },
        ],
        correctAnswer: {
          type: Schema.Types.Mixed,
          required: true,
          validate: [
            {
              validator: value => {
                return (
                  isPositive(Number(value)) ||
                  (isArray(value) &&
                    value.every(subValue => isPositive(Number(subValue))))
                );
              },
            },
          ],
        },
      },
    ],
    validate: v => Array.isArray(v) && v.length > 0,
  },
});

quizSchema.plugin(uniqueValidator);

quizSchema.methods.getPublicData = function () {
  const publicData = {
    title: this.title,
    permalink: this.permalink,
    questions: this.questions.map(question => ({
      question: question.question,
      type: question.type,
      answers: question.answers,
    })),
  };

  return publicData;
};

const quizModel = model<Quiz & Document>('Quiz', quizSchema);

export default quizModel;
