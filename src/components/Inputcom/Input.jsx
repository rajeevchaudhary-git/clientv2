import React from 'react'

function Input({
  label = '',
  name = '',
  type='',
  className='',
  placeholder='enter the text',
  isRequired = false,
  onchange =()=>{},
  value=""
   
}) {
 return (
    <div className='w-1/2'>
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-slate-200">
        {label}
      </label>
      <input
        type={type}
        id={name}
        className={bg-gray-50 border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${className}}
        placeholder={placeholder}
        required={isRequired} onChange={onchange} value={value}
      />
    </div>
  )
}

export default Input

