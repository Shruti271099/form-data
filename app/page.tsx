'use client'

import Sidebar from '@/components/others/sidebar'
import Main from '@/components/others/main'

export default function PersonalForm() {
  return (
    <main className='h-screen bg-[#fafafa]'>
      <div className='h-full grid grid-cols-3'>
        <Sidebar />
        <Main />
      </div>
    </main>
  )
}
