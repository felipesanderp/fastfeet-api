import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'
import { CancelAdminUseCase } from './cancel-admin'

let inMemoryAdminsRepository: InMemoryAdminRepository

let sut: CancelAdminUseCase

describe('Cancel Admin', () => {
  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminRepository()

    sut = new CancelAdminUseCase(inMemoryAdminsRepository)
  })

  it('should be able to cancel a admin', async () => {
    const admin = makeAdmin({}, new UniqueEntityID('admin-id'))
    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      adminId: admin.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0].isActive).toBeFalsy()
    expect(inMemoryAdminsRepository.items[0].cancelAt).toEqual(expect.any(Date))
  })

  it('should not be able to cancel a non existing admin', async () => {
    const result = await sut.execute({
      adminId: 'non-existing-admin-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
