import { RouteOptions } from 'fastify';
import { Routable } from '../app';
import { PostRequestDto } from '../dto/post-request-dto';
import { HTTP } from '../lib/http';
import PostService from '../service/post-service';

export default class PostApi implements Routable {
  readonly routes: RouteOptions[] = [];

  constructor(private readonly postService: PostService) {
    this.routes.push(
      this.getPost,
      this.createPost,
      //
    );
  }

  private getPost: RouteOptions = {
    method: 'GET',
    url: '/post/:id',
    handler: async request => {
      const { id } = request.getStrictParams('id');

      const post = await this.postService.getOne(parseInt(id));

      return post;
    },
  };

  private createPost: RouteOptions = {
    method: 'POST',
    url: '/post',
    onSend: HTTP.onSendHandler([HTTP.setStatus(201)]),
    handler: async request => {
      const dto = request.getBody(PostRequestDto);

      const { id } = await this.postService.save(dto);

      return { id };
    },
  };
}
