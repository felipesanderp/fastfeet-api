import { PaginationParams } from '@/core/repositories/pagination-params'
import { Deliveryman } from '../../enterprise/entities/deliveryman'

export abstract class DeliverymanRepository {
  abstract findAll(params: PaginationParams): Promise<Deliveryman[] | null>
  abstract findByCpf(cpf: string): Promise<Deliveryman | null>
  abstract findById(id: string): Promise<Deliveryman | null>
  abstract create(data: Deliveryman): Promise<void>
  abstract save(deliveryman: Deliveryman): Promise<void>
  abstract delete(deliveryman: Deliveryman): Promise<void>
}
