import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientsRepository {
  abstract findAll(): Promise<Recipient[] | null>
  abstract findByCpf(cpf: string): Promise<Recipient | null>
  abstract findById(id: string): Promise<Recipient | null>
  abstract create(data: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}
