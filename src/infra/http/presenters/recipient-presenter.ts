import { Recipient } from '@/domain/account/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name.toString(),
      cpf: recipient.cpf.value,
    }
  }
}
