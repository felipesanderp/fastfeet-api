import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Customer,
  CustomerProps,
} from '@/domain/order/enterprise/entities/customer'

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID,
) {
  const customer = Customer.create(
    {
      name: faker.person.firstName(),

      ...override,
    },
    id,
  )

  return customer
}
