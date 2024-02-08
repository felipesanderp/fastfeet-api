import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { GetRecipientByIdUseCase } from '@/domain/account/application/use-cases/get-recipient-by-id'
import { RecipientPresenter } from '../presenters/recipient-presenter'

@Controller('/users/recipient/:id')
@Roles(UserRoles.Admin)
export class GetRecipientByIdController {
  constructor(private getRecipientById: GetRecipientByIdUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') recipientId: string) {
    const result = await this.getRecipientById.execute({ recipientId })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { recipient } = result.value

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    }
  }
}
