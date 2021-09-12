import { RouteOptions } from 'fastify';
import { Routable } from '../app';
import { PostRequestDto } from '../dto/post-request-dto';
import PostService from '../service/post-service';

export default class PostApi implements Routable {
  readonly routes: RouteOptions[] = [];

  constructor(private readonly postService: PostService) {
    this.routes.push(this.getPost);
    this.routes.push(this.createPost);
  }

  private getPost: RouteOptions = {
    method: 'GET',
    url: '/post/:id',
    handler: async (req, resp) => {
      const { id } = req.getStrictParams('id');

      const post = await this.postService.getOne(parseInt(id));

      resp.send(post);
    },
  };

  private createPost: RouteOptions = {
    method: 'POST',
    url: '/post',
    handler: async (req, resp) => {
      const dto = req.getBody(PostRequestDto);

      const { id } = await this.postService.save(dto);

      resp.status(201).send({ id });
    },
  };
}
