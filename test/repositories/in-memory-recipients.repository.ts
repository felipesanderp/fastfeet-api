import { RecipientsRepository } from '@/domain/account/application/repositories/recipients-repository'
import { Recipient } from '@/domain/account/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public items: Recipient[] = []

  async findById(id: string): Promise<Recipient> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.cpf.value === cpf)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findAll(): Promise<Recipient[] | null> {
    const recipient = this.items

    if (!recipient) {
      return null
    }

    return recipient
  }

  async create(data: Recipient): Promise<void> {
    this.items.push(data)
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async delete(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items.splice(itemIndex, 1)
  }
}
