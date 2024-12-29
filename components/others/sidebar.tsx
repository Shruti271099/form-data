'use client'
import formData from '@/data/form.json'

import { kebabCase, get, lowerCase } from 'lodash'
import { useFormDataStore } from '@/store/form-data-store'

export default function Sidebar() {
  const { form } = formData
  const { activeSection, setActiveSection } = useFormDataStore()
  return (
    <aside className='h-full col-span-1 flex justify-center p-24'>
      <nav className='w-full'>
        <div className='font-semibold'>{form?.title}</div>
        <div className='text-black/50 text-sm mb-3'>{form?.description}</div>
        {get(form, 'groups', []).map(group => (
          <div onClick={() => setActiveSection(kebabCase(group?.title))} key={kebabCase(group?.title)} className={`w-full rounded-none p-4 ${kebabCase(group?.title) === activeSection ? 'bg-purple-500 text-white' : 'hover:bg-black/10'}  hover:cursor-pointer`}>
            <div className='font-semibold text-sm'>{group?.title}</div>
            <div className='opacity-75 text-xs'>Please enter your {lowerCase(group?.title)}</div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
