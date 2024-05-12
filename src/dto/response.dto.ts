export interface ResponseDTO<T> {
  code: number
  data: T
}

export function toResponseDTO<T>(obj: T | T[] | string, code: number, ...omitFields: (keyof T)[]): ResponseDTO<Omit<T, typeof omitFields[number]> | string> {
  if (typeof obj === 'string') {
    return {
      code,
      data: obj
    } as ResponseDTO<string>;
  }
  const mapFunction = (entity: T): Partial<T> => {
    const cleanedObj: Partial<T> = {}
    for (const key in entity) {
      if (!omitFields.includes(key as keyof T)) {
        cleanedObj[key] = entity[key]
      }
    }
    return cleanedObj
  }

  let cleanedData: Partial<T> | Partial<T>[]
  if (Array.isArray(obj)) {
    cleanedData = obj.map(mapFunction)
  } else {
    cleanedData = mapFunction(obj)
  }

  const mapObj: ResponseDTO<Omit<T, typeof omitFields[number]>> = {
    code,
    data: cleanedData as Omit<T, typeof omitFields[number]>
  }
  return mapObj
}

export type SingleMessageDTO = string