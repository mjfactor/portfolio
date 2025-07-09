"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Github, Linkedin } from "lucide-react"

export function Footer() {
    const contactInfo = [
        {
            icon: Mail,
            label: "Email",
            value: "emjayfactor@gmail.com",
            href: "mailto:emjayfactor@gmail.com"
        },
        {
            icon: Phone,
            label: "Phone",
            value: "09951712402",
            href: "tel:09951712402"
        }
    ]

    const socialLinks = [
        {
            icon: Github,
            label: "GitHub",
            href: "https://github.com/mjfactor",
            hoverColor: "hover:bg-[#24292e] hover:text-white hover:border-[#24292e]"
        },
        {
            icon: Linkedin,
            label: "LinkedIn",
            href: "https://linkedin.com/in/emjay-factor",
            hoverColor: "hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5]"
        }
    ]

    return (
        <footer className="bg-card border-t border-border/40">
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-6xl mx-auto">
                    {/* Main Footer Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="grid md:grid-cols-2 gap-4 mb-4"
                    >
                        {/* Contact Information */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Get In Touch</h3>
                            <div className="space-y-1">
                                {contactInfo.map((contact, index) => {
                                    const IconComponent = contact.icon
                                    return (
                                        <motion.div
                                            key={contact.label}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                        >
                                            <a
                                                href={contact.href}
                                                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
                                            >
                                                <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                                                    <IconComponent size={16} className="text-primary" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium">{contact.label}</div>
                                                    <div className="text-sm">{contact.value}</div>
                                                </div>
                                            </a>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Connect</h3>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => {
                                    const IconComponent = social.icon
                                    return (
                                        <motion.div
                                            key={social.label}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                        >
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className={`transition-colors ${social.hoverColor}`}
                                            >
                                                <a
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2"
                                                >
                                                    <IconComponent size={16} />
                                                    {social.label}
                                                </a>
                                            </Button>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Bottom Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="pt-4 border-t border-border/40 text-center"
                    >
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Emjay Factor. Built with{" "}
                            <span className="text-primary">Next.js</span> and{" "}
                            <span className="text-primary">TypeScript</span>.
                        </p>
                    </motion.div>
                </div>
            </div>
        </footer>
    )
}
