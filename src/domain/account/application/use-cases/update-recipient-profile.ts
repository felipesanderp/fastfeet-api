import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientAddress } from '../../enterprise/entities/value-objects/recipient-address'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface UpdateRecipientProfileUseCaseRequest {
  recipientId: string
  cpf: string
  name: string
  street: string
  number: number
  neighborhood: string
  city: string
  cep: string
  latitude: number
  longitude: number
}

type UpdateRecipientProfileUseCaseResponse = Either<
  ResourceNotFoundError,
  { recipient: Recipient }
>

@Injectable()
export class UpdateRecipientProfileUseCase {
  constructor(private recipientRepository: RecipientsRepository) {}

  async execute({
    recipientId,
    cpf,
    name,
    street,
    number,
    city,
    neighborhood,
    cep,
    latitude,
    longitude,
  }: UpdateRecipientProfileUseCaseRequest): Promise<UpdateRecipientProfileUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const newAddress = RecipientAddress.create({
      recipientId: recipient.id,
      cep,
      city,
      neighborhood,
      number,
      street,
      latitude,
      longitude,
    })

    recipient.name = name
    recipient.cpf = CPF.create(cpf)
    recipient.address = newAddress

    await this.recipientRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
