import { Either, left, right } from '@/core/either'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { SamePasswordError } from './errors/same-password-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface UpdateDeliverymanUseCaseRequest {
  deliverymanId: string
  newPassword: string
}

type UpdateDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError | SamePasswordError,
  null
>

@Injectable()
export class UpdateDeliverymanPasswordUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    deliverymanId,
    newPassword,
  }: UpdateDeliverymanUseCaseRequest): Promise<UpdateDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const isSamePassword = deliveryman.password === newPassword

    if (isSamePassword) {
      return left(new SamePasswordError())
    }

    const hashedPassword = await this.hashGenerator.hash(newPassword)

    deliveryman.password = hashedPassword

    await this.deliverymanRepository.save(deliveryman)

    return right(null)
  }
}
