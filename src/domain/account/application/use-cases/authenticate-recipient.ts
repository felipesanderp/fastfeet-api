import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface AuthenticateRecipientUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateRecipientUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateRecipientUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateRecipientUseCaseRequest): Promise<AuthenticateRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findByCpf(cpf)

    if (!recipient) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      recipient.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: recipient.id.toString(),
      role: 'recipient',
    })

    return right({
      accessToken,
    })
  }
}
