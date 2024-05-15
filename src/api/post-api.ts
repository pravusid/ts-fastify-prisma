import { route } from '../lib/fastify.js';
import { Hooks } from '../lib/hooks.js';
import type { PostService } from '../service/post-service.js';
import { type PostCreateDto, postCreateSchema, postFindSchema } from './schema/post-schema.js';

export class PostApi {
  constructor(private readonly postService: PostService) {}

  getPost = route({
    method: 'GET',
    url: '/post/:id',
    schema: postFindSchema,
    handler: async (request) => {
      const { id } = request.params;

      const post = await this.postService.getOne(id);

      return post;
    },
  });

  createPost = route({
    method: 'POST',
    url: '/post',
    schema: postCreateSchema,
    onSend: Hooks.onSendSetStatusCode(201)(),
    handler: async (request) => {
      const dto: PostCreateDto = request.body;

      const { id } = await this.postService.save(dto);

      return { id };
    },
  });
}

export default PostApi;
