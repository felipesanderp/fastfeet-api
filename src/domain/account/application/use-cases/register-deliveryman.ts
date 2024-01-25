import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AccountAlreadyExistsError } from './errors/account-already-exists-error'
import { HashGenerator } from '../cryptography/hash-generator'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'

interface RegisterDeliverymanUseCaseRequest {
  cpf: string
  name: string
  password: string
}

type RegisterDeliverymanUseCaseResponse = Either<
  AccountAlreadyExistsError,
  { deliveryman: Deliveryman }
>

@Injectable()
export class RegisterDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: RegisterDeliverymanUseCaseRequest): Promise<RegisterDeliverymanUseCaseResponse> {
    const deliverymanWithSameCpf =
      await this.deliverymanRepository.findByCpf(cpf)

    if (deliverymanWithSameCpf) {
      return left(new AccountAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
    })

    await this.deliverymanRepository.create(deliveryman)

    return right({
      deliveryman,
    })
  }
}
