import { IsArray, IsString } from 'class-validator';

import { Question } from '@interfaces/quizzes.interface';

export class CreateQuizDto {
  @IsString()
  public title: string;

  @IsArray()
  public questions: Question[];
}

export class UpdateQuizDto {
  @IsString()
  public title: string;

  @IsArray()
  public questions: Question[];
}
