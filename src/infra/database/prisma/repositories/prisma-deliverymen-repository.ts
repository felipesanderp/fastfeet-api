import { DeliverymanRepository } from '@/domain/account/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaDeliverymenRepository implements DeliverymanRepository {
  constructor(private prisma: PrismaService) {}

  async findAll({
    page,
    perPage,
  }: PaginationParams): Promise<Deliveryman[] | null> {
    const deliverymen = await this.prisma.user.findMany({
      where: {
        role: 'DELIVERYMAN',
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    if (deliverymen.length <= 0) {
      return null
    }

    return deliverymen.map(PrismaDeliverymanMapper.toDomain)
  }

  async findByCpf(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.create({
      data,
    })
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrismaUpdate(deliveryman)

    await this.prisma.user.update(data)
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: deliveryman.id.toString(),
      },
    })
  }
}
