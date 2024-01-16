'use client'

import { useSession, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function HomePage () {
  const { isSignedIn } = useSession()
  const { signOut } = useClerk()
  const router = useRouter()

  console.log({ isSignedIn })

  return (
    <button className='mt-40' onClick={async () => { await signOut(() => { router.push('/') }) }}>
      Sign out
    </button>
  )
}
