import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Injectable } from '@nestjs/common'

type GetAllRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient[]
  }
>

@Injectable()
export class GetAllRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute(): Promise<GetAllRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findAll()

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({
      recipient,
    })
  }
}
