import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'

import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetAllRecipientsUseCase } from '@/domain/account/application/use-cases/get-all-recipients'
import { RecipientPresenter } from '../presenters/recipient-presenter'

const getAllRecipientQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().min(1).optional().default(10),
})

const queryValidationPipe = new ZodValidationPipe(
  getAllRecipientQueryParamsSchema,
)

type GetAllRecipientQueryParamsSchema = z.infer<
  typeof getAllRecipientQueryParamsSchema
>

@Controller('/users/recipients')
@Roles(UserRoles.Admin)
export class GetAllRecipientsController {
  constructor(private getAllRecipients: GetAllRecipientsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) queries: GetAllRecipientQueryParamsSchema,
  ) {
    const { page, perPage } = queries

    const result = await this.getAllRecipients.execute({
      page,
      perPage,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const recipients = result.value.recipients

    return {
      recipients: recipients.map(RecipientPresenter.toHTTP),
    }
  }
}
