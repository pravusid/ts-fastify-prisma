import type { Post, Prisma, PrismaClient } from '@prisma/client';
import type { Logger } from '../lib/logger.js';

export class PostService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: Logger,
  ) {}

  getOne(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  save(input: Prisma.PostCreateInput): Promise<Pick<Post, 'id'>> {
    this.logger.debug('post will be created: %o', input);
    return this.prisma.post.create({ data: input, select: { id: true } });
  }
}

export default PostService;
