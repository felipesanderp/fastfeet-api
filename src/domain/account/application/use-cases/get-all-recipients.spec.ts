import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { GetAllRecipientUseCase } from './get-all-recipients'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { InMemoryRecipientAddressesRepository } from 'test/repositories/in-memory-recipient-address-repository'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryRecipientAddressesRepository: InMemoryRecipientAddressesRepository

let sut: GetAllRecipientUseCase

describe('Get All Recipients', () => {
  beforeEach(() => {
    inMemoryRecipientAddressesRepository =
      new InMemoryRecipientAddressesRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository(
      inMemoryRecipientAddressesRepository,
    )

    sut = new GetAllRecipientUseCase(inMemoryRecipientsRepository)
  })

  it('should be able to get all recipients', async () => {
    const recipient1 = makeRecipient(
      { name: 'recipient-1' },
      new UniqueEntityID('recipient-1-id'),
    )

    const recipient2 = makeRecipient(
      { name: 'recipient-2' },
      new UniqueEntityID('recipient-2-id'),
    )
    inMemoryRecipientsRepository.items.push(recipient1, recipient2)

    const result = await sut.execute({
      page: 1,
      perPage: 20,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientsRepository.items).toHaveLength(2)
    expect(inMemoryRecipientsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'recipient-1',
        }),
        expect.objectContaining({
          name: 'recipient-2',
        }),
      ]),
    )
  })

  it('should be able to fetch paginated recipients', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRecipientsRepository.create(
        makeRecipient({ name: 'John Doe' }),
      )
    }

    const result = await sut.execute({
      page: 2,
      perPage: 20,
    })

    expect(result.value?.recipients).toHaveLength(2)
  })
})
