import Link from 'next/link'
import Image from 'next/image'
import { Ham, ChefHat, Briefcase, CalendarFold, Sprout } from 'lucide-react'

export function Header() {
    return(
        <header className="h-30 w-full sticky">
            <section id="headerInfo" className="h-full flex items-center justify-center gap-12 lg:gap-16">
                <Link href="/catalogo" className='text-base text-gray-600 font-semibold'>Catálogo</Link>
                <Link href="/faq" className='text-base text-gray-600 font-semibold'>FAQ</Link>

                <Link href="/">
                <Image
                src="/images/black-logo.png"
                width={120}
                height={120}
                alt="Logo Grill Viana"
                priority
                quality={100}

                ></Image>
                </Link>
                
                <Link href="/contato" className='text-base text-gray-600 font-semibold'>Contato</Link >
                <Link href="/sobre" className='text-base text-gray-600 font-semibold'>Sobre a Loja</Link>
                
            </section>
            <section id='headerLinks' className="flex items-center justify-center gap-10 lg:gap-20 py-4">
                <Link href="" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><Ham size={34}/>Churras com Amigos</Link>
                <Link href="" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><ChefHat size={34}/>Pro Chef</Link>
                <Link href="" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><Briefcase size={34}/>Portáteis</Link>
                <Link href="" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><CalendarFold size={34}/>Para Todos os Dias</Link>
                <Link href="" className='text-base text-gray-600 font-semibold flex flex-col items-center gap-2'><Sprout size={34}/>Vida ao Ar Livre</Link>
            </section>
        </header>
    )
}