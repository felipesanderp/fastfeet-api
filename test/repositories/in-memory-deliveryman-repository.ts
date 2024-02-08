import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliverymanRepository } from '@/domain/account/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'

export class InMemoryDeliverymanRepository implements DeliverymanRepository {
  public items: Deliveryman[] = []

  async findById(id: string): Promise<Deliveryman> {
    const deliveryman = this.items.find((item) => item.id.toString() === id)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async findByCpf(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = this.items.find((item) => item.cpf.value === cpf)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async findAll({
    page,
    perPage,
  }: PaginationParams): Promise<Deliveryman[] | null> {
    const deliverymen = this.items.slice((page - 1) * perPage, page * perPage)

    if (!deliverymen) {
      return null
    }

    return deliverymen
  }

  async create(data: Deliveryman): Promise<void> {
    this.items.push(data)
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)

    this.items[itemIndex] = deliveryman
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)

    this.items.splice(itemIndex, 1)
  }
}
