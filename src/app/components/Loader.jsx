import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
        <Loader2 className='w-8 h-8 text-white animate-spin'/>
    </div>
  )
}

export default Loader