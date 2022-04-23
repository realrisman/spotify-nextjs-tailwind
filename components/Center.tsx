import { ChevronDownIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

const Center = () => {
  const { data: session } = useSession()
  const [color, setColor] = useState<string | undefined | null>(null)

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [])

  return (
    <div className="flex-grow">
      <header className="absolute right-8 top-5">
        <div className="flex cursor-pointer items-center space-x-3 rounded-full bg-red-300 p-1 pr-2 opacity-90 hover:opacity-80">
          <img
            src={session?.user?.image!}
            alt=""
            className="h-10 w-10 rounded-full"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex h-80 w-full items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        {/* <img src="" alt="" /> */}
        <h1>Hello</h1>
      </section>
    </div>
  )
}

export default Center
