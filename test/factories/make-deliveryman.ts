import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/account/enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaDeliverymanMapper } from '@/infra/database/prisma/mappers/prisma-deliveryman-mapper'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
  isActive?: boolean,
) {
  const cpf = faker.number
    .int({
      min: 10000000000,
      max: 99999999999,
    })
    .toString()
    .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')

  const deliveryman = Deliveryman.create(
    {
      name: faker.person.fullName(),
      cpf: CPF.create(cpf),
      password: faker.internet.password(),
      ...override,
    },
    id,
    isActive,
  )

  return deliveryman
}

@Injectable()
export class DeliverymanFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryman(data: Partial<DeliverymanProps> = {}) {
    const deliveryman = makeDeliveryman(data)

    await this.prisma.user.create({
      data: PrismaDeliverymanMapper.toPrisma(deliveryman),
    })

    return deliveryman
  }
}
