import { currentUser, auth } from '@clerk/nextjs'

export default async function ReservePage () {
  // const user = await currentUser()
  const auth2 = auth()

  console.log({ auth2 })

  return (
    <div className='bg-blue-200 lg:ml-[290px] mt-16'>
      ReservePage
    </div>
  )
}
