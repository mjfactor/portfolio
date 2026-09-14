import type { Metadata } from "next"
import Link from "next/link"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | Emjay Factor",
  description: "Privacy policy for the Emjay Factor portfolio and connected third-party services.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-background/80 px-4 py-5 backdrop-blur-sm sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight hover:text-primary">
            Emjay Factor
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            Back to portfolio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-14 sm:px-8 sm:py-20">
        <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Legal</p>
          <h1>Privacy Policy</h1>
          <p>Last updated: September 15, 2026</p>

          <h2>What this policy covers</h2>
          <p>
            This policy explains how Emjay Factor handles information when you visit this portfolio or choose
            to use a connected publishing feature. The portfolio is publicly viewable and does not require an
            account to browse.
          </p>

          <h2>Information you provide</h2>
          <ul>
            <li>Messages you choose to send through the portfolio chat feature.</li>
            <li>Contact details you voluntarily send by email or another linked channel.</li>
            <li>Content and preferences you provide when using an optional publishing workflow.</li>
          </ul>

          <h2>Connected third-party accounts and services</h2>
          <p>
            If you connect a third-party account or service, the application may receive the authorization
            information and account details required by that service&apos;s approved API scopes. It may also process
            the media, captions, and publishing choices needed to complete an action you request. We use that
            information only to provide the connected feature, maintain its security, and respond to support
            requests.
          </p>
          <p>
            We do not sell your personal information or use content from connected services for advertising. You
            can revoke access at any time through the relevant service or by contacting us; access may also be
            removed when the connected feature no longer needs it.
          </p>

          <h2>How information is used and shared</h2>
          <p>
            Information is used to operate the site, respond to requests, protect the service, and provide the
            features you select. Information may be processed by service providers that host the site or support
            its functionality, and by third-party platforms such as TikTok when you ask us to use their APIs.
            Those services process information under their own policies.
          </p>

          <h2>Retention and security</h2>
          <p>
            We retain information only for as long as reasonably needed for the purpose it was collected, legal
            obligations, security, or dispute resolution. We use reasonable safeguards, but no internet service can
            guarantee absolute security.
          </p>

          <h2>Your choices</h2>
          <p>
            You may ask what personal information we hold about you, request correction or deletion where legally
            available, or withdraw consent for optional processing. Contact{" "}
            <a href="mailto:emjayfactor@gmail.com">emjayfactor@gmail.com</a> to make a request.
          </p>

          <h2>Changes and contact</h2>
          <p>
            We may update this policy when the site or connected features change. The date above shows when it was
            last revised. For privacy questions, contact{" "}
            <a href="mailto:emjayfactor@gmail.com">emjayfactor@gmail.com</a>.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  )
}