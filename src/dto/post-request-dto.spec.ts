import { PostRequestDto } from './post-request-dto';

describe('Test PostRequestDto', () => {
  it('title must not be empty', () => {
    const dto = Object.assign(new PostRequestDto(), {
      author: 'kim',
      content: 'hello world',
    } as Partial<PostRequestDto>);

    expect(() => dto.validate()).toThrowError('title should not be empty');
  });
});
