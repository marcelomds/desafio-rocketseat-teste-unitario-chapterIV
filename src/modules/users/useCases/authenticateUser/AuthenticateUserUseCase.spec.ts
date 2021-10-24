import { hash } from 'bcryptjs';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';

let authenticateUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it('should be able to authenticate an user', async () => {
    const user = await usersRepository.create({
      name: 'John do',
      email: 'john@do.com',
      password: '123123'
    });

    const authUser = await authenticateUseCase.execute({
      email: user.email,
      password: '123123',
    });

    expect(authUser).toHaveProperty('token');
  });

});
