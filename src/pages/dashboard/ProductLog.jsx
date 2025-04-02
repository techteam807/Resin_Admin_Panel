import { ArrowDownIcon } from '@heroicons/react/24/solid'
import React from 'react'

const ProductLog = () => {
  return (
    <div>
      <div className="bg-clip-border rounded-xl bg-white text-gray-700 border border-blue-gray-100 mt-9 shadow-sm p-4">
        <div className='space-y-4'>
          <div className='border px-3 py-2 rounded-md w-max'>New</div>
          <div><ArrowDownIcon width={18} height={18} /></div>
          <div className='border px-3 py-2 rounded-md w-max'>Inuse</div>
          <div><ArrowDownIcon width={18} height={18} /></div>
          <div className='border px-3 py-2 rounded-md w-max'>Exhausted</div>
        </div>
      </div>
    </div>
  )
}

export default ProductLog
