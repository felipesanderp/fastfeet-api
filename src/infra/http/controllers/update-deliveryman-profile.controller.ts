import { z } from 'zod'

import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UpdateDeliverymanProfileUseCase } from '@/domain/account/application/use-cases/update-deliveryman-profile'

const updateDeliverymanProfileBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  updateDeliverymanProfileBodySchema,
)

type UpdateDeliverymanProfileBodySchema = z.infer<
  typeof updateDeliverymanProfileBodySchema
>

@Controller('/accounts/deliveryman/:id')
@Roles(UserRoles.Admin)
export class UpdateDeliverymanProfileController {
  constructor(
    private updateDeliverymanProfile: UpdateDeliverymanProfileUseCase,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateDeliverymanProfileBodySchema,
    @Param('id') deliverymanId: string,
  ) {
    const { name, cpf } = body

    const result = await this.updateDeliverymanProfile.execute({
      deliverymanId,
      name,
      cpf,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
