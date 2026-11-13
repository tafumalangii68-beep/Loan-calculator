/** Simple text-friendly mark: a stack of three bars that shrink, like a balance being paid down. */
export function Logo() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0">
      <rect width="24" height="24" rx="6" className="fill-accent" />
      <rect x="6" y="6.5" width="12" height="2.5" rx="1.25" fill="#fff" />
      <rect x="6" y="10.75" width="8.5" height="2.5" rx="1.25" fill="#fff" opacity=".85" />
      <rect x="6" y="15" width="5" height="2.5" rx="1.25" fill="#fff" opacity=".7" />
    </svg>
  );
}
