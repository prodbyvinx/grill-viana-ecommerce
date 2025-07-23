import Link from 'next/link'
import { Ham, ChefHat, Briefcase, CalendarFold, Sprout } from 'lucide-react'

export default function Categories() {
    return(
        <>
            <section id='headerLinks' className="bg-gray-50 flex items-center justify-center gap-10 lg:gap-20 py-4">
                <Link href="/" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><Ham size={34}/>Churras com Amigos</Link>
                <Link href="/" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><ChefHat size={34}/>Pro Chef</Link>
                <Link href="/" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><Briefcase size={34}/>Portáteis</Link>
                <Link href="/" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><CalendarFold size={34}/>Para Todos os Dias</Link>
                <Link href="/" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><Sprout size={34}/>Vida ao Ar Livre</Link>
            </section>
        </>
    )
}

