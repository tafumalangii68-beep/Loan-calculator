/**
 * Shared look for the desktop header links. The active state comes from
 * `data-active="true"` on the surrounding <li class="group/item">, set by
 * HeaderNav from the current path.
 */
export const navLinkClass = [
  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.93rem] font-medium whitespace-nowrap",
  "text-ink/75 transition-colors hover:bg-accent-soft hover:text-accent-strong",
  "group-data-[active=true]/item:bg-accent group-data-[active=true]/item:text-white",
  "group-data-[active=true]/item:shadow-[0_1px_3px_rgba(32,92,64,0.35)]",
].join(" ");
