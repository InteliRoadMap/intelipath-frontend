import { Link } from 'react-router-dom'
import { MapTrifold } from '@phosphor-icons/react'

type LogoProps = {
  className?: string
  iconOnly?: boolean
  hideIcon?: boolean
}

export default function Logo({
  className = "",
  iconOnly = false,
  hideIcon = false
}: LogoProps) {
  return (
    <Link to="/" className={`flex items-center gap-2 select-none hover:opacity-90 transition-opacity ${className}`}>
      {!hideIcon && (
        <div className="bg-[#0a0a0a] text-white p-1 rounded-md flex items-center justify-center shrink-0">
          <MapTrifold size={18} weight="fill" />
        </div>
      )}
      {!iconOnly && (
        <div className="flex flex-col">
          <span className="font-bold text-[18px] tracking-tight text-inherit">
            InteliPath
          </span>
        </div>
      )}
    </Link>
  )
}
