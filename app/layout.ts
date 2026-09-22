import { html, asset } from '@webjsdev/core';
import type { LayoutProps } from '@webjsdev/core';

/**
 * Root layout: the ONLY file that writes the document shell. It links the
 * compiled Tailwind stylesheet and defines the app's design tokens, then
 * renders ${children}.
 *
 * Theming: every colour token is written ONCE with the native CSS
 * light-dark(LIGHT, DARK) function, and `color-scheme: light dark` lets the
 * OS pick the side. The app ships no manual theme switch, so there is no saved
 * choice to restore and no pre-paint script is needed: the first paint already
 * matches the OS. Adding a switch later means writing `data-theme` on <html>
 * plus the two `:root[data-theme=...]` rules below.
 */

// Favicon via metadata.icons so the framework emits the <link> into <head> (a
// hand-written <link> in the template body is ignored by browsers).
export const metadata = { icons: '/public/favicon.svg' };

export default function RootLayout({ children }: LayoutProps) {
  return html`
    <meta name="color-scheme" content="light dark">
    <!-- asset() content-hashes the url in production, so a deploy that changes
         the CSS changes the url and the framework serves it immutable for a
         year. Without it this stable url can serve the PREVIOUS stylesheet
         from a CDN or a service-worker cache after a deploy. -->
    <link rel="stylesheet" href=${asset('/public/tailwind.css')}>
    <style>
      /* Design tokens. The NAMES are infrastructure (public/input.css maps them
         into Tailwind via @theme, so bg-background / text-muted-foreground
         resolve); the VALUES are this app's look: a warm-neutral page with a
         single indigo accent for the active player and the winning line. */
      :root {
        --font-sans: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        --font-serif: ui-serif, Georgia, serif;
        --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        --radius: 0.75rem;

        color-scheme: light dark;                                 /* follow the OS */
        --background:           light-dark(#fbfaf9, #17181c);
        --foreground:           light-dark(#1b1c20, #e8e8ea);
        --card:                 light-dark(#ffffff, #212329);
        --card-foreground:      light-dark(#1b1c20, #e8e8ea);
        --popover:              light-dark(#ffffff, #212329);
        --popover-foreground:   light-dark(#1b1c20, #e8e8ea);
        --primary:              light-dark(#4f46e5, #a5b4fc);
        --primary-foreground:   light-dark(#ffffff, #1b1c20);
        --secondary:            light-dark(#eeedeb, #2a2d34);
        --secondary-foreground: light-dark(#1b1c20, #e8e8ea);
        --muted:                light-dark(#f1f0ee, #22252b);
        --muted-foreground:     light-dark(#5e5f66, #9a9ba3);
        --accent:               light-dark(#e9e8e5, #2f333b);
        --accent-foreground:    light-dark(#1b1c20, #f4f4f6);
        --border:               light-dark(#e1e0dd, #343841);
        --border-strong:        light-dark(#c9c8c4, #434853);
        --input:                light-dark(#e1e0dd, #2a2d34);
        --ring:                 light-dark(#8b8a92, #6d6f78);
        --destructive:          light-dark(#b3261e, #f2b8b5);
        --destructive-foreground: light-dark(#ffffff, #1b1c20);
        /* A translucent tint of the primary, tracked across both themes for free. */
        --primary-tint: color-mix(in srgb, var(--primary) 22%, transparent);
      }
      /* Present for a future manual switch; with neither attribute set the
         color-scheme declared above follows the OS. */
      :root[data-theme='light'] { color-scheme: light; }
      :root[data-theme='dark']  { color-scheme: dark; }
    </style>
    <style>
      /* Base styles utility classes cannot reach. */
      html, body { margin: 0; }
      body {
        background: var(--background);
        color: var(--foreground);
        font: 15px/1.6 var(--font-sans);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    </style>
    <main class="min-h-dvh max-w-3xl mx-auto px-6 py-10">
      ${children}
    </main>
  `;
}
