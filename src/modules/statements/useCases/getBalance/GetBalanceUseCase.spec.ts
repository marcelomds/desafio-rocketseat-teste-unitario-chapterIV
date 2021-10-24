import { OperationType } from '../../entities/Statement';

import { User } from '../../../users/entities/User';
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from './GetBalanceUseCase';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';

let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

describe('Get Balance Use Case', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      statementRepository,
      usersRepository
    );
  });

  it('should be able to list all balances.', async () => {
    const user: User = await usersRepository.create({
      email: 'john@do.com',
      name: 'John do',
      password: '123123',
    });

    const statement = await statementRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'farra'
    });

    const statement2 = await statementRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'farra'
    });

    const statement3 = await statementRepository.create({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 500,
      description: 'farra'
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id,
    });

    expect(balance).toStrictEqual({
      statement: expect.arrayContaining([statement,   statement2,   statement3]),
      balance: 1500,
    });
  });

  it('should not be able to list a balance with non existing user', async () => {

    await expect(getBalanceUseCase.execute({
      user_id: 'no-user',
    })).rejects.toBeInstanceOf(GetBalanceError);
  });

});
