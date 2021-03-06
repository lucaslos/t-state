export type Serializable =
  | boolean
  | number
  | string
  | null
  | Serializable[]
  | undefined
  | { [key: string]: Serializable };
