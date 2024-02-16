import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface CancelRecipientUseCaseRequest {
  recipientId: string
}

type CancelRecipientUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class CancelRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({
    recipientId,
  }: CancelRecipientUseCaseRequest): Promise<CancelRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.changeStatus(false)

    await this.recipientsRepository.save(recipient)

    return right(null)
  }
}
