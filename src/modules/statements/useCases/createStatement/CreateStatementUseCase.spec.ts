import { CreateStatementUseCase } from './CreateStatementUseCase';

import { OperationType } from '../../entities/Statement';

import { User } from '../../../users/entities/User';
import { CreateStatementError } from './CreateStatementError';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import UserNotFound = CreateStatementError.UserNotFound;
import InsufficientFunds = CreateStatementError.InsufficientFunds;

let createStatementUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

describe('Create Statement Use Case', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementRepository
    );
  });

  it('should be able to create a new statement.', async () => {
    const user: User =  await usersRepository.create({
      email: 'john@do.com',
      name: 'John do',
      password: '123123',
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'farra'
    });

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to create a new statement with non existing user', async () => {

    await expect(createStatementUseCase.execute({
      user_id: 'no-user',
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Salary'
    })).rejects.toBeInstanceOf(UserNotFound);
  });

  it('should not be able to create a new statement with insufficient founds', async () => {
    const user: User =  await usersRepository.create({
      email: 'john@do.com',
      name: 'John do',
      password: '123123',
    });

    await expect(createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 1000,
      description: 'Code'
    })).rejects.toBeInstanceOf(InsufficientFunds);
  });
});
