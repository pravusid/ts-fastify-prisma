import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { BaseDto } from './base-dto';

export class PostRequestDto extends BaseDto implements Prisma.PostCreateInput {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  author: string;

  @IsNotEmpty()
  content: string;
}
