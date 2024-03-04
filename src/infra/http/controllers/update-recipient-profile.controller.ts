import { z } from 'zod'

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { UpdateRecipientProfileUseCase } from '@/domain/account/application/use-cases/update-recipient-profile'

const updateRecipientProfileBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  street: z.string(),
  number: z.number(),
  neighborhood: z.string(),
  city: z.string(),
  cep: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(
  updateRecipientProfileBodySchema,
)

type UpdateRecipientBodySchema = z.infer<
  typeof updateRecipientProfileBodySchema
>

@Controller('/accounts/recipient/:id')
@Roles(UserRoles.Admin)
export class UpdateRecipientProfileController {
  constructor(private updateRecipientProfile: UpdateRecipientProfileUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateRecipientBodySchema,
    @Param('id') recipientId: string,
  ) {
    const {
      name,
      cpf,
      street,
      number,
      neighborhood,
      city,
      cep,
      latitude,
      longitude,
    } = body

    const result = await this.updateRecipientProfile.execute({
      recipientId,
      name,
      cpf,
      street,
      number,
      neighborhood,
      city,
      cep,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
