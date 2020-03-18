export type ValidationTypes = 'string' | 'number'
export type ValidateStruct = ValidationTypes | [ValidationTypes] | { [x: string]: ValidateStruct }

const keys = <T extends { [x: string]: any }, K extends keyof T>(value: T) =>
  Object.keys(value) as K[]
const isString = (value: any): value is string => typeof value === 'string'
const isNumber = (value: any): value is number => typeof value === 'number'
const isFunction = (value: any): value is Function => typeof value === 'function'
const isArray = (value: any): value is any[] => Array.isArray(value)
const isObject = (value: any): value is { [x: string]: any } =>
  typeof value === 'object' && !isFunction(value) && !isArray(value) && value !== null

export const validate = (valids: ValidateStruct, param: any): boolean => {
  if ((valids && !param) || (!valids && param)) return false
  if (isArray(valids))
    return param.reduce((a: boolean, b: any) => a && validate(valids[0], b), true)
  if (isObject(valids))
    return keys(valids).reduce((a, key) => a && validate(valids[key], param[key]), true as boolean)
  if (valids === 'string') return isString(param)
  if (valids === 'number') return isNumber(param)
  return false
}
