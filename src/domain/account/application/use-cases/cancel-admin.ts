import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { Injectable } from '@nestjs/common'

interface CancelAdminUseCaseRequest {
  adminId: string
}

type CancelAdminUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class CancelAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    adminId,
  }: CancelAdminUseCaseRequest): Promise<CancelAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    admin.changeStatus(false)

    await this.adminsRepository.save(admin)

    return right(null)
  }
}
