import { Either, left, right } from '@/core/either'
import { HashGenerator } from '../cryptography/hash-generator'
import { SamePasswordError } from './errors/same-password-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Injectable } from '@nestjs/common'

interface UpdateRecipientPasswordUseCaseRequest {
  recipientId: string
  newPassword: string
}

type UpdateRecipientPasswordUseCaseResponse = Either<
  ResourceNotFoundError | SamePasswordError,
  null
>

@Injectable()
export class UpdateRecipientPasswordUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    recipientId,
    newPassword,
  }: UpdateRecipientPasswordUseCaseRequest): Promise<UpdateRecipientPasswordUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const isSamePassword = recipient.password === newPassword

    if (isSamePassword) {
      return left(new SamePasswordError())
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    recipient.password = hashedPassword

    await this.recipientsRepository.save(recipient)

    return right(null)
  }
}
