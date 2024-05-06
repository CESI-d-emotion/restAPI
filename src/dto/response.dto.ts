export interface ResponseDTO<T> {
  code: number
  data: T
}

export function toResponseDTO<T>(input: T, code: number): ResponseDTO<T> {
  return {
    code,
    data: input
  }
}

export type SingleMessageDTO = string