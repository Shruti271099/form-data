'use client'
import formData from '@/data/form.json'
import { kebabCase, get, camelCase } from 'lodash'

import { useFormDataStore } from '@/store/form-data-store'

import Form from '@/components/form/form'

export default function Main() {
  const { form } = formData
  const { activeSection } = useFormDataStore()
  const currentFormSection = get(form, 'groups', []).find(d => kebabCase(d.title) === activeSection)
  return (
    <main className='h-full col-span-2 bg-white px-10 py-24'>
      <h2 className='font-semibold text-lg'>{currentFormSection?.title}</h2>
      <p className='text-black/50 text-sm mb-3'>Please fill in all the required information below for this section.</p>
      <Form fields={get(currentFormSection, 'fields', [])} id={camelCase(currentFormSection?.title)} />
    </main>
  )
}
