import Image from "next/image"
import { motion } from "framer-motion"

export function Navbar() {
    const scrollToSection = (sectionId: string) => {
        if (sectionId === "home") {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        } else {
            const element = document.getElementById(sectionId)
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                })
            }
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
            <div className="container mx-auto flex justify-between items-center py-3 px-4 sm:px-8">
                <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
                    <span className="font-semibold tracking-tight text-foreground">Emjay Factor</span>
                </motion.div>
                <nav className="flex items-center gap-2 sm:gap-6">
                    <motion.button
                        onClick={() => scrollToSection("home")}
                        className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        Home
                    </motion.button>
                    <motion.button
                        onClick={() => scrollToSection("projects")}
                        className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        Projects
                    </motion.button>
                </nav>
            </div>
        </header>
    )
}
