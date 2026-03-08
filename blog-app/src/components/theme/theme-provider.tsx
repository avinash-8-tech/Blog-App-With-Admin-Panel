'use client'
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes'
import Header from '../layout/header'
import Footer from '../layout/footer'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface ExtendedThemeProviderProps extends ThemeProviderProps {
    containerClassName?: string
}

export function ThemeProvider({
    children,
    containerClassName,
    ...props
}: ExtendedThemeProviderProps) {
    const pathname = usePathname()
    const isAuthPage = pathname === '/auth'

    return (
        <NextThemesProvider {...props}>
            <div className="min-h-screen flex flex-col">
                
                {!isAuthPage && <Header />}
                
                <main className={cn(
                    'flex-1',
                    !isAuthPage && 'container mx-auto px-4', 
                    containerClassName
                )}>
                    {children}
                </main>
                
                
                {!isAuthPage && <Footer />}
            </div>
        </NextThemesProvider>
    )
}