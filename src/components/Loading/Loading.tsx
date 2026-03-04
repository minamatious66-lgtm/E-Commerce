
import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      
     
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-indigo-500 
                      flex items-center justify-center shadow-lg mb-6 animate-pulse">
        <span className="text-white font-bold text-xl text-center">Shop Mart</span>
      </div>

      
      <div className="flex space-x-3">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce animation-delay-150"></div>
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-bounce animation-delay-300"></div>
      </div>

    </div>
  )
}