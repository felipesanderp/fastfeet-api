import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AccountAlreadyExistsError } from './errors/account-already-exists-error'
import { HashGenerator } from '../cryptography/hash-generator'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { Location } from '../services/location'
import { RecipientAddress } from '../../enterprise/entities/value-objects/recipient-address'

interface RegisterRecipientUseCaseRequest {
  cpf: string
  name: string
  password: string
  street: string
  number: number
  neighborhood: string
  city: string
  cep: string
}

type RegisterRecipientUseCaseResponse = Either<
  AccountAlreadyExistsError,
  { recipient: Recipient }
>

@Injectable()
export class RegisterRecipientUseCase {
  constructor(
    private recipientRepository: RecipientsRepository,
    private hashGenerator: HashGenerator,
    private location: Location,
  ) {}

  async execute({
    cpf,
    name,
    password,
    street,
    number,
    city,
    neighborhood,
    cep,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipientWithSameCpf = await this.recipientRepository.findByCpf(cpf)

    if (recipientWithSameCpf) {
      return left(new AccountAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const recipient = Recipient.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
    })

    const { latitude, longitude } = await this.location.search({ cep })

    const address = RecipientAddress.create({
      recipientId: recipient.id,
      cep,
      city,
      neighborhood,
      number,
      street,
      latitude,
      longitude,
    })

    recipient.address = address

    await this.recipientRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
