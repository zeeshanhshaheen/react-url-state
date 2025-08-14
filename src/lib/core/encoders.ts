import { z } from 'zod'

export interface FieldTypeInfo {
  type: string
  isOptional: boolean
  isArray: boolean
}

export function getFieldType(schema: z.ZodTypeAny, key: string): FieldTypeInfo {
  if (schema instanceof z.ZodObject) {
    const shape = (schema as unknown as { shape: Record<string, z.ZodTypeAny> }).shape
    let field = shape[key]
    
    if (!field) {
      return { type: 'string', isOptional: true, isArray: false }
    }

    let isOptional = false
    let isArray = false

    if (field instanceof z.ZodOptional || field instanceof z.ZodNullable) {
      isOptional = true
      field = field.unwrap() as z.ZodTypeAny
    }

    if (field instanceof z.ZodDefault) {
      field = field._def.innerType as z.ZodTypeAny
    }

    if (field instanceof z.ZodArray) {
      isArray = true
      field = field.element as z.ZodTypeAny
    }

    const type = getZodType(field)
    return { type, isOptional, isArray }
  }
  
  return { type: 'string', isOptional: true, isArray: false }
}

function getZodType(schema: z.ZodTypeAny): string {
  if (schema instanceof z.ZodString) return 'string'
  if (schema instanceof z.ZodNumber) return 'number'
  if (schema instanceof z.ZodBoolean) return 'boolean'
  if (schema instanceof z.ZodDate) return 'date'
  if (schema instanceof z.ZodEnum) return 'enum'
  if (schema instanceof z.ZodLiteral) return 'literal'
  return 'string'
}

export function decodeValue(value: string | string[], typeInfo: FieldTypeInfo): unknown {
  const { type, isArray } = typeInfo
  
  if (isArray) {
    const arrayValues = Array.isArray(value) ? value : value ? [value] : []
    return arrayValues.map(v => decodeSingleValue(v, type))
  }

  const singleValue = Array.isArray(value) ? value[0] : value
  return decodeSingleValue(singleValue, type)
}

function decodeSingleValue(value: string, type: string): unknown {
  if (!value && value !== '0') return undefined

  switch (type) {
    case 'number':
      const num = Number(value)
      return isNaN(num) ? undefined : num
    
    case 'boolean':
      return value === 'true' || value === '1'
    
    case 'date':
      const date = new Date(value)
      return isNaN(date.getTime()) ? undefined : date
    
    case 'enum':
    case 'literal':
    case 'string':
    default:
      return value
  }
}

export function encodeValue(value: unknown, typeInfo: FieldTypeInfo): string | string[] {
  if (value === undefined || value === null) return ''

  const { type, isArray } = typeInfo

  if (isArray) {
    const arrayValue = Array.isArray(value) ? value : [value]
    return arrayValue.map(v => encodeSingleValue(v, type)).filter(v => v !== '')
  }

  return encodeSingleValue(value, type)
}

function encodeSingleValue(value: unknown, type: string): string {
  if (value === undefined || value === null) return ''

  switch (type) {
    case 'boolean':
      return value ? '1' : '0'
    
    case 'date':
      return value instanceof Date ? value.toISOString() : String(value)
    
    case 'number':
    case 'enum':
    case 'literal':
    case 'string':
    default:
      return String(value)
  }
}