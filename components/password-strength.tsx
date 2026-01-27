"use client"

interface PasswordStrengthProps {
  password: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: '', color: '' }
    
    let score = 0
    
    // Length check
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    
    // Complexity checks
    if (/[a-z]/.test(pwd)) score++ // lowercase
    if (/[A-Z]/.test(pwd)) score++ // uppercase
    if (/[0-9]/.test(pwd)) score++ // numbers
    if (/[^a-zA-Z0-9]/.test(pwd)) score++ // special chars
    
    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-red-500' }
    if (score <= 4) return { score: 2, label: 'Medium', color: 'bg-yellow-500' }
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' }
  }
  
  const strength = getStrength(password)
  
  if (!password) return null
  
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <div className={`h-1.5 flex-1 rounded-full transition-all ${
          strength.score >= 1 ? strength.color : 'bg-gray-200'
        }`} />
        <div className={`h-1.5 flex-1 rounded-full transition-all ${
          strength.score >= 2 ? strength.color : 'bg-gray-200'
        }`} />
        <div className={`h-1.5 flex-1 rounded-full transition-all ${
          strength.score >= 3 ? strength.color : 'bg-gray-200'
        }`} />
      </div>
      <p className="text-xs text-gray-600">
        Password strength: <span className={`font-medium ${
          strength.label === 'Weak' ? 'text-red-600' :
          strength.label === 'Medium' ? 'text-yellow-600' :
          'text-emerald-600'
        }`}>{strength.label}</span>
      </p>
      <ul className="text-xs text-gray-600 space-y-1">
        <li className={password.length >= 8 ? 'text-emerald-600' : ''}>
          {password.length >= 8 ? '✓' : '○'} At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) ? 'text-emerald-600' : ''}>
          {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
        </li>
        <li className={/[0-9]/.test(password) ? 'text-emerald-600' : ''}>
          {/[0-9]/.test(password) ? '✓' : '○'} One number
        </li>
        <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-emerald-600' : ''}>
          {/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'} One special character
        </li>
      </ul>
    </div>
  )
}
