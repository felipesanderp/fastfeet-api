import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Injectable } from '@nestjs/common'

interface GetAllRecipientUseCaseRequest {
  page: number
  perPage: number
}

type GetAllRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipients: Recipient[]
  }
>

@Injectable()
export class GetAllRecipientsUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    page,
    perPage,
  }: GetAllRecipientUseCaseRequest): Promise<GetAllRecipientUseCaseResponse> {
    const recipients = await this.recipientsRepository.findAll({
      page,
      perPage,
    })

    if (!recipients) {
      return left(new ResourceNotFoundError())
    }

    return right({
      recipients,
    })
  }
}
