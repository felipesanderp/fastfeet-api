import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AdminsRepository } from '../repositories/admins-repository'

interface DeleteAdminUseCaseRequest {
  adminId: string
}

type DeleteAdminUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteAdminUseCase {
  constructor(private adminsRepository: AdminsRepository) {}

  async execute({
    adminId,
  }: DeleteAdminUseCaseRequest): Promise<DeleteAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    await this.adminsRepository.delete(admin)

    return right(null)
  }
}
