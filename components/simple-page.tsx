import type { ReactNode } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { Container } from "./content-blocks";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

/** Shared layout for About, Contact, legal and other text pages. */
export function SimplePage({
  title,
  path,
  intro,
  updated,
  children,
}: {
  title: string;
  path: string;
  intro?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <Container className="pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: title, path },
        ]}
      />
      <div className="prose-content mx-auto mt-6 max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="text-lg text-muted">{intro}</p>}
        {updated && (
          <p className="text-sm text-muted">
            Last updated: <time dateTime={updated}>{dateFormat.format(new Date(updated))}</time>
          </p>
        )}
        {children}
      </div>
    </Container>
  );
}
