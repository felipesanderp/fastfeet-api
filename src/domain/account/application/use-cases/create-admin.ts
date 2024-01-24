import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AccountAlreadyExistsError } from './errors/account-already-exists-error'
import { Admin } from '../../enterprise/entities/admin'
import { AdminsRepository } from '../repositories/admins-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { CPF } from '../../enterprise/entities/value-objects/cpf'

interface CreateAdminUseCaseRequest {
  cpf: string
  name: string
  password: string
}

type CreateAdminUseCaseResponse = Either<
  AccountAlreadyExistsError,
  { admin: Admin }
>

@Injectable()
export class CreateAdminUseCase {
  constructor(
    private adminsRepository: AdminsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    name,
    password,
  }: CreateAdminUseCaseRequest): Promise<CreateAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminsRepository.findByCpf(cpf)

    if (adminWithSameCpf) {
      return left(new AccountAlreadyExistsError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
    })

    return right({
      admin,
    })
  }
}
