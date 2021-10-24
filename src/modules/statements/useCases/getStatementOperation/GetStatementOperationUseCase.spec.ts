import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';

import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { IStatementsRepository } from '../../repositories/IStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';

import { User } from '../../../users/entities/User';
import { OperationType, Statement}  from '../../entities/Statement';
import {GetStatementOperationError} from "./GetStatementOperationError";


let usersRepository: IUsersRepository;
let statementRepository: IStatementsRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get Statement operation', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();

    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementRepository);
  });

  it('should be able to get a statement operation', async () => {
    const user: User = await usersRepository.create({
      email: 'john@do.com',
      name: 'John do',
      password: '123123',
    });

    const statement: Statement = await statementRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Test'
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    });

    expect(statementOperation).toBe(statement);
  });

  it('should not be able to get a statement operation with non existent user', async () => {
    const statement: Statement = await statementRepository.create({
      user_id: 'no-user',
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'Test'
    });

    await expect(getStatementOperationUseCase.execute({
      user_id: 'no-user',
      statement_id: statement.id
    })).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('should not be able to get a statement operation with non existent statement', async () => {
    const user: User = await usersRepository.create({
      email: 'john@do.com',
      name: 'John do',
      password: '123123',
    });

    await expect(getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: 'no-statement'
    })).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
