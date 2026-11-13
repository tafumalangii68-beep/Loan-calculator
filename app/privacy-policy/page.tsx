import Link from "next/link";
import { SimplePage } from "@/components/simple-page";
import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { buildMetadata } from "@/lib/seo";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your information: calculations run in your browser, loan details are not stored or transmitted, and no tracking runs by default.`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <SimplePage title="Privacy policy" path="/privacy-policy" updated={siteConfig.legalUpdated}>
      <p>
        This policy explains what information {siteConfig.name} (“we”, “us”) handles when you use this website at{" "}
        {siteConfig.url.replace(/^https?:\/\//, "")}, and the choices you have. In short, we built this site to work
        without collecting your personal information.
      </p>

      <section aria-labelledby="calculators">
        <h2 id="calculators">Loan details you enter</h2>
        <p>
          All calculations happen in your web browser using JavaScript. The amounts, rates, terms and other values you
          enter are <strong>not sent to our server or to any third party, and are not saved</strong> — not in cookies,
          not in local storage. They are cleared when you refresh or leave the page.
        </p>
      </section>

      <section aria-labelledby="storage">
        <h2 id="storage">Cookies and browser storage</h2>
        <p>
          We store one item in your browser’s local storage, named <code>{CONSENT_STORAGE_KEY}</code>. It records your
          cookie choices (whether you allowed optional analytics or marketing) and when you made them, so we don’t ask
          again on every page. It stays on your device until you clear your browser data, and we can’t read it from our
          server. We don’t set any other cookies.
        </p>
        <p>
          We do not currently use analytics, advertising or other tracking scripts, whatever choice you make. If we add
          any in future, they will be off until you opt in, and we will update this policy first. See our{" "}
          <Link href="/cookie-policy">cookie policy</Link> for details. You can change your choices at any time:{" "}
          <CookieSettingsButton className="link" label="open cookie settings" />.
        </p>
      </section>

      <section aria-labelledby="logs">
        <h2 id="logs">Information collected automatically by our hosting</h2>
        <p>
          Like any website, this site is delivered by a web server. When your browser requests a page, our hosting
          provider may automatically process technical information such as your IP address, browser type, the page
          requested and the time of the request, to deliver the site, keep it secure and diagnose problems. We do not use
          this information to identify you or build a profile. How long such logs are kept depends on the hosting
          provider’s settings.
        </p>
      </section>

      <section aria-labelledby="fonts">
        <h2 id="fonts">Fonts and third-party services</h2>
        <p>
          Our fonts are bundled with the site and served from our own domain, so loading a page does not contact a
          third-party font service. The site does not embed third-party widgets, advertising or social media plugins.
          Links to other websites, such as government sources, take you to sites with their own privacy policies.
        </p>
      </section>

      <section aria-labelledby="contact-info">
        <h2 id="contact-info">If you contact us</h2>
        <p>
          The contact form on our <Link href="/contact">contact page</Link> doesn’t send anything to us. It opens a draft
          in your own email app. If you email us, we receive your email address and whatever you include in the
          message. We use it only to read and reply to your message, and we delete correspondence when it is no longer
          needed.
        </p>
      </section>

      <section aria-labelledby="sharing">
        <h2 id="sharing">Sale and sharing of personal information</h2>
        <p>
          We do not sell personal information or share it for targeted advertising. We would only disclose information
          if required by law.
        </p>
      </section>

      <section aria-labelledby="rights">
        <h2 id="rights">Your choices and rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct or delete personal information we hold
          about you, or to object to certain uses. Because we don’t collect calculator data or create accounts, we
          usually hold nothing about you beyond any emails you send us. To make a request, contact us through our{" "}
          <Link href="/contact">contact page</Link>. You can remove the stored cookie choice at any time by clearing this
          site’s data in your browser.
        </p>
      </section>

      <section aria-labelledby="children">
        <h2 id="children">Children</h2>
        <p>
          This website is intended for adults and is not directed at children under 13. We do not knowingly collect
          personal information from children.
        </p>
      </section>

      <section aria-labelledby="changes">
        <h2 id="changes">Changes to this policy</h2>
        <p>
          If our practices change, for example if we add an analytics service, we will update this page and the date at
          the top before the change takes effect.
        </p>
      </section>

      <section aria-labelledby="contact">
        <h2 id="contact">Contact</h2>
        <p>
          Questions about this policy can be sent through our <Link href="/contact">contact page</Link>.
        </p>
      </section>
    </SimplePage>
  );
}
