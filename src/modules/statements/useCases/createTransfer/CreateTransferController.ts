import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransferUseCase } from './CreateTransferUseCase';

enum OperationType {
  TRANSFER = 'transfer',
}

export class CreateTransferController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description, sender_id } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const statement = await createTransfer.execute({
      user_id,
      sender_id,
      type,
      amount,
      description
    });

    return response.status(201).send(statement);
  }
}
