import Link from "next/link";
import { ArrowRight, Check, Mail, MessagesSquare, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Container } from "@/components/content-blocks";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { PageImage } from "@/components/page-image";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

const title = "Contact Us";
const description = `Contact ${siteConfig.name} with questions, bug reports, corrections or ideas for our loan calculators and guides. Send a message or email us directly.`;

export const metadata = buildMetadata({ title, description, path: "/contact" });

const helpTopics = [
  "Questions about the calculators",
  "Report a bug or calculation issue",
  "Suggest a new calculator or feature",
  "Feedback on the website experience",
  "Other related inquiries",
];

const card = "rounded-3xl border border-line bg-white p-6 shadow-[0_1px_2px_rgba(37,37,34,0.04)] sm:p-8";

export default function ContactPage() {
  const email = siteConfig.contactEmail;
  const endpoint = siteConfig.contactFormEndpoint;

  return (
    <Container className="pt-8">
      <JsonLd data={webPageJsonLd({ title, description, path: "/contact" })} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: `${title} | ${siteConfig.name}`,
          url: absoluteUrl("/contact"),
          mainEntity: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            ...(email && { contactPoint: { "@type": "ContactPoint", contactType: "customer support", email } }),
          },
        }}
      />
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      {/* Hero */}
      <div className="mt-6 grid items-center gap-8 md:grid-cols-2 lg:gap-12">
        <div>
          <h1 className="font-serif text-5xl font-semibold tracking-tight text-ink sm:text-6xl">Contact Us</h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
            Questions, corrections or ideas for the calculators are all welcome. We’re happy to help.
          </p>
        </div>
        <PageImage path="/contact" priority sizes="(min-width: 768px) 50vw, 100vw" />
      </div>

      {/* Form + details */}
      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <section aria-labelledby="send-message" className={card}>
          <h2 id="send-message" className="font-serif text-3xl font-semibold tracking-tight text-ink">
            Send Us a Message
          </h2>
          <div className="mt-6">
            {email && endpoint ? (
              <ContactForm endpoint={endpoint} email={email} />
            ) : (
              <p className="text-muted">
                Our contact form is being set up. In the meantime, the <Link href="/faq" className="link">FAQ</Link>{" "}
                answers the most common questions about the calculators.
              </p>
            )}
          </div>
        </section>

        <div className="grid gap-6">
          {email && (
            <section
              aria-labelledby="contact-details"
              className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-accent-soft/70 to-white p-6 sm:p-8"
            >
              <div
                aria-hidden="true"
                className="absolute -top-10 -right-12 size-44 rounded-full bg-accent-soft"
              />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-white">
                    <Mail aria-hidden="true" className="size-6" />
                  </span>
                  <h2 id="contact-details" className="font-serif text-2xl font-semibold tracking-tight text-ink">
                    Contact Details
                  </h2>
                </div>
                <p className="mt-5 font-semibold text-ink">Email Us</p>
                <a
                  href={`mailto:${email}`}
                  className="mt-1 inline-block text-lg font-semibold break-all text-accent hover:text-accent-strong hover:underline"
                >
                  {email}
                </a>
                <p className="mt-4 flex items-start gap-2.5 text-sm leading-relaxed text-ink/80">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" />
                  We read every message. For questions about your own loan, please contact your lender, as we can’t
                  give personal financial advice.
                </p>
              </div>
            </section>
          )}

          <section aria-labelledby="help-with" className={`${card} relative overflow-hidden`}>
            <MessagesSquare
              aria-hidden="true"
              className="absolute top-6 right-6 hidden size-16 text-accent-soft sm:block"
              strokeWidth={1.5}
            />
            <h2 id="help-with" className="font-serif text-2xl font-semibold tracking-tight text-ink">
              What Can We Help With?
            </h2>
            <ul className="mt-5 space-y-3">
              {helpTopics.map((topic) => (
                <li key={topic} className="flex items-start gap-3 text-ink/85">
                  <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={2.5} />
                  {topic}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Before you write */}
      <section
        aria-labelledby="before-you-write"
        className="mt-12 grid items-center gap-6 rounded-3xl border border-line bg-white/70 p-6 sm:p-8 md:grid-cols-[auto_1px_minmax(0,1fr)] md:gap-10"
      >
        <ClipboardIllustration className="mx-auto h-36 w-auto md:h-40" />
        <div aria-hidden="true" className="hidden h-32 w-px bg-line-strong md:block" />
        <div>
          <h2 id="before-you-write" className="font-serif text-3xl font-semibold tracking-tight text-ink">
            Before You Write
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-muted">
            You may also check our{" "}
            <Link href="/faq" className="link">
              FAQ
            </Link>
            , where we’ve answered the most common questions about the calculators.
          </p>
          <Link
            href="/faq"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl border-2 border-accent px-5 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft"
          >
            View FAQ
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
    </Container>
  );
}

/** Clipboard with a checklist and a pencil, drawn inline in the site's colours. */
function ClipboardIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} role="img" aria-label="Clipboard with a checklist and a pencil">
      <path d="M30 150C18 120 40 92 62 104 58 76 86 70 92 96" fill="#E9F0E4" />
      <path d="M200 160c18-10 22-40 4-50-6 22-20 30-30 34" fill="#E9F0E4" />
      <ellipse cx="122" cy="186" rx="86" ry="8" fill="#E5DFD6" opacity=".7" />
      <rect x="62" y="34" width="112" height="146" rx="14" fill="#205C40" />
      <rect x="72" y="46" width="92" height="124" rx="8" fill="#FFFFFF" />
      <rect x="96" y="24" width="44" height="22" rx="8" fill="#759879" />
      <circle cx="118" cy="24" r="7" fill="#205C40" />
      {[72, 104, 136].map((y) => (
        <g key={y}>
          <path d={`M84 ${y}l6 6 11-12`} stroke="#205C40" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="110" y={y - 4} width="44" height="6" rx="3" fill="#CDB994" />
          <rect x="110" y={y + 6} width="30" height="5" rx="2.5" fill="#E5DFD6" />
        </g>
      ))}
      <g transform="rotate(38 186 112)">
        <rect x="178" y="56" width="16" height="92" rx="4" fill="#759879" />
        <rect x="178" y="56" width="16" height="14" rx="4" fill="#205C40" />
        <path d="M178 148h16l-8 18Z" fill="#E2CC9C" />
        <path d="M183 159h6l-3 7Z" fill="#252522" />
      </g>
    </svg>
  );
}
