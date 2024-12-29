'use client'
import React, { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { ArrowRight, ChevronDown } from 'lucide-react'
import { kebabCase, get, camelCase, isEmpty } from 'lodash'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { FormField, FormSection } from '@/lib/types'
import { useFormDataStore } from '@/store/form-data-store'

const createFormSchema = (fields: FormField[]) => {
  const schema: { [key: string]: z.ZodString | z.ZodOptional<z.ZodString> | z.ZodArray<z.ZodString> } = {}
  fields.forEach(field => {
    const message = `${field.label} is required`
    if (field.type === 'checkbox') {
      schema[field.name] = z.array(z.string())
    } else schema[field.name] = field.required ? z.string().min(1, { message }) : z.string().optional()
  })
  return z.object(schema)
}

const Form = ({ id, fields }: FormSection) => {
  const schema = createFormSchema(fields)
  const { filledData, setFilledData, activeSection } = useFormDataStore()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({ resolver: zodResolver(schema), defaultValues: {} })

  const onSubmit = (d: z.infer<typeof schema>) => {
    const data = { ...filledData }
    data[id] = d
    setFilledData(data)
  }

  const ErrorComponent = ({ error }: { error: { message: string } }) => {
    if (isEmpty(error)) return ''
    return (
      <span className={'mt-1 text-xs text-destructive'} role='alert' aria-live='polite'>
        {error?.message}
      </span>
    )
  }

  const renderField = (field: FormField) => {
    const error = errors[field.name as never] as { message: string }
    if (['text', 'number'].includes(field?.type)) {
      return (
        <div className='w-full lg:flex-1'>
          <Input {...(field?.type === 'number' ? { min: field?.min, max: field?.max } : {})} type={field.type} placeholder={field.placeholder} className={`rounded-none ${!isEmpty(error) ? 'border-destructive' : ''} `} {...register(field.name as never)} />
          <ErrorComponent error={error} />
        </div>
      )
    }
    if (field?.type === 'textarea') {
      return (
        <div className='w-full lg:flex-1'>
          <Textarea placeholder={field.placeholder} className={`rounded-none ${!isEmpty(error) ? 'border-destructive' : ''} `} {...register(field.name as never)} />
          <ErrorComponent error={error} />
        </div>
      )
    }
    if (field?.type === 'dropdown') {
      const value = watch(field.name as never)
      return (
        <div className='w-full lg:flex-1'>
          <DropdownMenu>
            <DropdownMenuTrigger className={`w-full rounded-none justify-between outline-none ${!isEmpty(error) ? 'border-destructive' : ''}`} asChild>
              <Button variant='outline'>
                <span className={isEmpty(value) ? 'text-black/50' : ''}>{isEmpty(value) ? `Select ${field.label}` : value}</span>
                <ChevronDown className='-me-1 ms-2 opacity-60' size={16} strokeWidth={2} aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='rounded-none min-w-[--radix-dropdown-menu-trigger-width]'>
              {field?.options?.map(option =>
                typeof option === 'string' ? (
                  <DropdownMenuItem className='cursor-pointer' onClick={() => setValue(field.name as never, option as never)} key={option}>
                    {option}
                  </DropdownMenuItem>
                ) : (
                  ''
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <ErrorComponent error={error} />
        </div>
      )
    }
    if (['radio', 'checkbox'].includes(field?.type)) {
      return (
        <div className='w-full lg:flex-1'>
          {field?.options?.map(option =>
            typeof option !== 'string' ? (
              <div key={option.value} className='flex items-center mb-2'>
                <input {...register(field.name as never)} id={option.value} type={field?.type} value={option.value} className='w-4 h-4 accent-purple-500 text-purple-500 bg-gray-100 border-gray-300' />
                <label htmlFor={option.value} className='ms-2 text-sm text-gray-900 dark:text-gray-300'>
                  {option.label}
                </label>
              </div>
            ) : (
              ''
            )
          )}
          <ErrorComponent error={error} />
        </div>
      )
    }
    if (['slider'].includes(field?.type)) {
      const value = watch(field.name as never)
      return (
        <div className='w-full lg:flex-1'>
          <div className='flex text-xs'>{value}</div>
          <input {...register(field.name as never)} type='range' min={field.min} max={field.max} step={field.step} className='w-full h-1.5 accent-purple-500 bg-gray-100 appearance-none cursor-pointer' />
          <div className='flex items-center justify-between text-xs text-black/50'>
            <div>{field.min}</div>
            <div>{field.max}</div>
          </div>
          <ErrorComponent error={error} />
        </div>
      )
    }
    return <div className='w-full lg:flex-1'></div>
  }

  useEffect(() => {
    if (filledData[id]) reset(filledData[id])
    else {
      const schema: { [key: string]: string | string[] } = {}
      fields.forEach(field => {
        schema[field.name] = field.type === 'checkbox' ? [] : ''
      })
      reset(schema)
    }
    return () => {}
  }, [activeSection, filledData])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='h-[90%] max-h-[90%] overflow-y-auto mb-2'>
        {fields.map(field => (
          <div key={kebabCase(field?.label)} className='flex flex-col lg:flex-row mb-3'>
            <div className='w-full lg:w-1/3 text-sm'>
              {field?.label} {field?.required ? <span className='text-destructive'>*</span> : ''}
            </div>
            {renderField(field)}
          </div>
        ))}
      </div>
      <Button type='submit' className='group rounded-none  bg-purple-500 hover:bg-purple-300'>
        SAVE
        <ArrowRight className='-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5' size={16} strokeWidth={2} aria-hidden='true' />
      </Button>
    </form>
  )
}

export default Form
