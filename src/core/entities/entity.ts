import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity<Props> {
  private _id: UniqueEntityID
  private _isActive: boolean
  private _cancelAt: Date
  protected props: Props

  get id() {
    return this._id
  }

  get isActive() {
    return this._isActive
  }

  get cancelAt() {
    return this._cancelAt
  }

  protected constructor(props: Props, id?: UniqueEntityID, isActive?: boolean) {
    this._id = id ?? new UniqueEntityID()
    this._isActive = isActive ?? true
    this.props = props
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }

  public changeStatus(isActive: boolean) {
    this._isActive = isActive
    this._cancelAt = new Date()
  }
}
