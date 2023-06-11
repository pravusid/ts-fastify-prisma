import { Post, PrismaClient } from '@prisma/client';
import { PostCreateDto } from '../api/schema/post-type';
import { Logger } from '../lib/logger';

export class PostService {
  constructor(
    //
    private readonly prisma: PrismaClient,
    private readonly logger: Logger,
  ) {}

  getOne(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  save(dto: PostCreateDto): Promise<Pick<Post, 'id'>> {
    const data = dto;
    this.logger.debug('post will be created: %o', data);
    return this.prisma.post.create({ data, select: { id: true } });
  }
}

export default PostService;
