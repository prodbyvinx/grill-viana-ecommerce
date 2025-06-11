import { Montserrat } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const inter = Montserrat({
  subsets: ['latin'],
  display: 'swap',
})
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}