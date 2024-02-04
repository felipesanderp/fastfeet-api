import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RecipientAddress } from "@/domain/account/enterprise/entities/value-objects/recipient-address"
import { Prisma, Address as PrismaAddress } from '@prisma/client'

export class PrismaRecipientAddressMapper {
  static toDomain(raw: PrismaAddress): RecipientAddress {
    return RecipientAddress.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        cep: raw.cep,
        city: raw.city,
        neighborhood: raw.neighborhood,
        number: raw.number,
        street: raw.street,
        latitude: Number(raw.latitude),
        longitude: Number(raw.longitude)
      },
    )
  }

  static toPrisma(recipientAddress: RecipientAddress): Prisma.AddressUncheckedCreateInput {
    return {
      recipientId: recipientAddress.recipientId.toString(),
      cep: recipientAddress.cep,
      city: recipientAddress.city,
      neighborhood: recipientAddress.neighborhood,
      number: recipientAddress.number,
      street: recipientAddress.street,
      latitude: recipientAddress.latitude,
      longitude:recipientAddress.longitude
    }
  }
}
