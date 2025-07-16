import React from 'react'

interface EmptyCardProps {
  imgSrc: string;
  message: string;
}

const EmptyCard:React.FC<EmptyCardProps> = ({imgSrc, message}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      <div className="relative mb-8">
        <img src={imgSrc} alt="No memories" className="w-32 h-32 object-contain opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"></div>
      </div>
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">No Memories Yet</h3>
        <p className="text-slate-600 leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  )
}

export default EmptyCard