import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { Admin } from '@/domain/account/enterprise/entities/admin'

export class InMemoryAdminRepository implements AdminsRepository {
  public items: Admin[] = []

  async findById(id: string): Promise<Admin> {
    const admin = this.items.find((item) => item.id.toString() === id)

    if (!admin) {
      return null
    }

    return admin
  }

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = this.items.find((admin) => admin.cpf.value === cpf)

    if (!admin) {
      return null
    }

    return admin
  }

  async create(data: Admin): Promise<void> {
    this.items.push(data)
  }

  async save(admin: Admin): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items[itemIndex] = admin
  }

  async delete(admin: Admin): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === admin.id)

    this.items.splice(itemIndex, 1)
  }
}
