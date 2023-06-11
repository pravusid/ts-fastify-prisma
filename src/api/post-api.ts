import { route } from '../lib/fastify';
import { HTTP } from '../lib/http';
import { PostService } from '../service/post-service';
import { postCreateSchema, postFindSchema } from './schema/post-type';

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
    onSend: HTTP.onSendSetStatus(201),
    handler: async (request) => {
      const dto = request.body;

      const { id } = await this.postService.save(dto);

      return { id };
    },
  });
}

export default PostApi;
