export type FormField = {
  name: string
  label: string
  src?: string
  type: string
  placeholder?: string
  options?: string[] | { label: string; value: string }[]
  required?: boolean
  min?: number
  max?: number
  step?: number
}

export type FormSection = {
  id: string
  title?: string
  fields: FormField[]
}

export type JsonObject = { [key: string]: string | string[] | number | boolean | JsonObject | undefined }
