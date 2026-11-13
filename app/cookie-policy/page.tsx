import Link from "next/link";
import { SimplePage } from "@/components/simple-page";
import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { buildMetadata } from "@/lib/seo";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Cookie Policy",
  description: `Which cookies and browser storage ${siteConfig.name} uses, what each category means, and how to change your choices.`,
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  const { analytics, marketing } = siteConfig.optionalServices;

  return (
    <SimplePage title="Cookie policy" path="/cookie-policy" updated={siteConfig.legalUpdated}>
      <p>
        Cookies are small files that websites store in your browser. Websites can also use similar browser storage,
        such as local storage. This page explains what we use and why.
      </p>

      <section aria-labelledby="summary">
        <h2 id="summary">Summary</h2>
        <p>
          We use one necessary local storage entry to remember your cookie choice. We don’t set tracking cookies, and
          we don’t currently run analytics or advertising scripts. Your loan calculations are never stored.
        </p>
      </section>

      <section aria-labelledby="categories">
        <h2 id="categories">Categories</h2>
        <div className="not-prose my-6 overflow-x-auto rounded-xl border border-line bg-white" tabIndex={0} aria-label="Storage categories, scrollable table">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-paper text-xs text-muted">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium">Category</th>
                <th scope="col" className="px-4 py-2.5 font-medium">What we use</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Can you turn it off?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line align-top">
              <tr>
                <th scope="row" className="px-4 py-3 font-medium">Necessary</th>
                <td className="px-4 py-3">
                  Local storage item <code>{CONSENT_STORAGE_KEY}</code>: stores your cookie choices and the date you
                  made them. Kept until you clear your browser data.
                </td>
                <td className="px-4 py-3">No, but you can delete it by clearing site data. You will then be asked again.</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium">Analytics</th>
                <td className="px-4 py-3">{analytics ? analytics.name : "None in use."}</td>
                <td className="px-4 py-3">Yes. Off unless you opt in.</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium">Marketing</th>
                <td className="px-4 py-3">{marketing ? marketing.name : "None in use."}</td>
                <td className="px-4 py-3">Yes. Off unless you opt in.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The optional categories are shown so you can set your preference in advance. If we ever add a service in one
          of them, it will only load if you have allowed that category, and we will update this page first.
        </p>
      </section>

      <section aria-labelledby="manage">
        <h2 id="manage">Changing your choices</h2>
        <p>
          You can review or change your choices at any time with the “Cookie settings” link in the footer of every page,
          or here: <CookieSettingsButton className="link" label="open cookie settings" />. Withdrawing consent takes
          effect immediately for future page loads.
        </p>
        <p>
          You can also block or delete cookies and site data in your browser settings. The calculators keep working if
          you do.
        </p>
      </section>

      <section aria-labelledby="more">
        <h2 id="more">More information</h2>
        <p>
          See our <Link href="/privacy-policy">privacy policy</Link> for how we handle information in general.
        </p>
      </section>
    </SimplePage>
  );
}
