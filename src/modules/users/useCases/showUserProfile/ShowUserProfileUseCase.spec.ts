
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';

import {ShowUserProfileUseCase} from "./ShowUserProfileUseCase";
import {User} from "../../entities/User";
import {ShowUserProfileError} from "./ShowUserProfileError";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: IUsersRepository;

describe('Show Profile User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await usersRepository.create({
      name: 'John do',
      email: 'john@do.com',
      password: '123123'
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toBeInstanceOf(User);
    expect(userProfile).toEqual(expect.objectContaining({
      name: user.name,
      email: user.email,
    }));
  });

  it('should not be able to show user profile non existing user', async () => {
    await expect(showUserProfileUseCase.execute('non-existing-user'))
      .rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
