import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'

interface AuthenticateDeliverymanUSeCaseRequest {
  cpf: string
  password: string
}

type AuthenticateDeliverymanUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateDeliverymanUSeCaseRequest): Promise<AuthenticateDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findByCpf(cpf)

    if (!deliveryman) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      deliveryman.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: deliveryman.id.toString(),
      role: 'deliveryman',
    })

    return right({
      accessToken,
    })
  }
}
