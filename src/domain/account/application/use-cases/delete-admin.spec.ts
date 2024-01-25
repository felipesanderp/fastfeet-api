import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DeleteAdminUseCase } from './delete-admin'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'

let inMemoryAdminsRepository: InMemoryAdminRepository

let sut: DeleteAdminUseCase

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminRepository()

    sut = new DeleteAdminUseCase(inMemoryAdminsRepository)
  })

  it('should be able to delete a admin', async () => {
    const admin = makeAdmin({}, new UniqueEntityID('admin-id'))
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non existing admin', async () => {
    const result = await sut.execute({
      adminId: 'non-existing-admin-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
