import { CustomersRepository } from '@/domain/order/application/repositories/customer-repository'
import { Customer } from '@/domain/order/enterprise/entities/customer'

export class InMemoryCustomerRepository implements CustomersRepository {
  public items: Customer[] = []

  async findById(id: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.id.toString() === id)

    if (!customer) {
      return null
    }

    return customer
  }
}
