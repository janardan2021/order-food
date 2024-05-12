import Link from "next/link";
import { usePathname } from "next/navigation"

export default function UserNavigation({isAdmin}) {
    const path = usePathname()
  return (
    <div className="w-full flex justify-around items-center gap-6 font-medium my-2 px-4" >
        <Link href={'/profile'} className={path === '/profile' ? 'text-white font-semibold button' : 'button text-gray-300'}>Profile</Link>
        <Link href={'/orders'} className={path === '/orders' ? 'text-white font-semibold button' : 'button text-gray-300'}>Orders</Link>
        {isAdmin && (
          <>
          <Link href={'/menus'} className={path === '/menus' ? 'text-white font-semibold button' : 'button text-gray-300'}>Menus</Link>
          <Link href={'/users'} className={path === '/users' ? 'text-white font-semibold button' : 'button text-gray-300'}>Users</Link>
          </>
        )}
      </div>
  )
}
