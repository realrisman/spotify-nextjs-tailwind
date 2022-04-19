import { useSession } from 'next-auth/react'

const Center = () => {
  const { data } = useSession()

  console.log(data)

  return (
    <div className="flex flex-grow text-white">
      <h1>I am Center</h1>
      <header>
        <div>
          <img src={data?.user?.image!} alt="" />
        </div>
      </header>
    </div>
  )
}

export default Center
