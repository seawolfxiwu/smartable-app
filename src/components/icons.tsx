import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 3h18v18H3z" fill="hsl(var(--primary))" stroke="none" />
      <path d="M7 7h4v4H7z" fill="hsl(var(--background))" stroke="none" />
      <path d="M7 13h4v4H7z" fill="hsl(var(--background))" stroke="none" />
      <path d="M13 7h4v4h-4z" fill="hsl(var(--background))" stroke="none" />
      <path d="M13 13h4v4h-4z" fill="hsl(var(--accent))" stroke="none" />
    </svg>
  );
}
