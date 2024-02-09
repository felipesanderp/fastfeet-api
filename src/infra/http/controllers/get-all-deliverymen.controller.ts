import { GetAllDeliverymenUseCase } from '@/domain/account/application/use-cases/get-all-deliverymen'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import { DeliverymanPresenter } from '../presenters/deliveryman-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'

const getAllDeliverymenQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().min(1).optional().default(10),
})

const queryValidationPipe = new ZodValidationPipe(
  getAllDeliverymenQueryParamsSchema,
)

type GetAllDeliverymenQueryParamsSchema = z.infer<
  typeof getAllDeliverymenQueryParamsSchema
>

@Controller('/users/deliverymen')
@Roles(UserRoles.Admin)
export class GetAllDeliverymenController {
  constructor(private getAllDeliverymen: GetAllDeliverymenUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query(queryValidationPipe) queries: GetAllDeliverymenQueryParamsSchema,
  ) {
    const { page, perPage } = queries

    const result = await this.getAllDeliverymen.execute({
      page,
      perPage,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { deliverymen } = result.value

    return {
      deliverymen: deliverymen.map(DeliverymanPresenter.toHTTP),
    }
  }
}
