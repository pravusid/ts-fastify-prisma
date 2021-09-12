import { Post, PrismaClient } from '@prisma/client';
import type { PostRequestDto } from '../dto/post-request-dto';
import { Logger } from '../lib/logger';

export default class PostService {
  constructor(
    //
    private readonly prisma: PrismaClient,
    private readonly logger: Logger,
  ) {}

  getOne(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  save(dto: PostRequestDto): Promise<Pick<Post, 'id'>> {
    const data = dto;
    this.logger.debug('post will be created: %o', data);
    return this.prisma.post.create({ data, select: { id: true } });
  }
}
