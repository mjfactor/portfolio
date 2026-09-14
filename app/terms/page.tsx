import type { Metadata } from "next"
import Link from "next/link"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Terms of Service | Emjay Factor",
  description: "Terms of service for the Emjay Factor portfolio and connected third-party services.",
}

export default function TermsPage() {
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
          <h1>Terms of Service</h1>
          <p>Last updated: September 15, 2026</p>

          <h2>Agreement</h2>
          <p>
            These Terms of Service govern your use of the Emjay Factor portfolio website and any optional
            features that let you connect a third-party account or publish content. By using the site, you
            agree to these terms. If you do not agree, do not use the site or connected features.
          </p>

          <h2>Portfolio and connected publishing features</h2>
          <p>
            The portfolio is primarily a showcase of software projects and professional work. If a connected
            publishing feature is offered, you authorize it to perform only the actions you select, such as
            preparing or publishing content to your connected account through the relevant service&apos;s approved
            APIs. You are responsible for reviewing content and selecting the correct audience before publishing.
          </p>

          <h2>Your responsibilities</h2>
          <ul>
            <li>You must provide accurate information and keep your connected account secure.</li>
            <li>You must own or have permission to use content you submit or publish.</li>
            <li>You must comply with the terms, community guidelines, and developer policies of each service you connect.</li>
            <li>You must not use the site to distribute unlawful, infringing, deceptive, or harmful content.</li>
          </ul>

          <h2>Third-party services</h2>
          <p>
            Services you choose to connect are independent third parties. Their availability, policies, and
            handling of your account are controlled by them. We do not guarantee that a third-party API will
            remain available or approve every request to publish.
          </p>

          <h2>Availability and disclaimers</h2>
          <p>
            The site is provided on an as-is and as-available basis. Features may change, be interrupted, or be
            removed. To the extent permitted by law, Emjay Factor is not responsible for losses caused by your
            use of third-party services, content you publish, or an interruption in the site.
          </p>

          <h2>Changes and contact</h2>
          <p>
            These terms may be updated as the site or connected features change. Continued use after an update
            means you accept the revised terms. Questions can be sent to{" "}
            <a href="mailto:emjayfactor@gmail.com">emjayfactor@gmail.com</a>.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  )
}