export interface BaseModel {
  id: number | string | undefined
  toJson(): any
}
