import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { kebabCase, get } from 'lodash'

import formData from '@/data/form.json'
import { JsonObject } from '@/lib/types'

interface State {
  activeSection: string
  setActiveSection: (by: string) => void
  filledData: JsonObject
  setFilledData: (by: JsonObject) => void
}

export const useFormDataStore = create<State>()(
  persist(
    set => ({
      activeSection: kebabCase(get(formData, 'form.groups[0].title', '')),
      setActiveSection: payload => set({ activeSection: payload }),
      filledData: {},
      setFilledData: payload => set({ filledData: payload }),
    }),
    { name: 'form-data-storage' }
  )
)
