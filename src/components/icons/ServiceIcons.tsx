// Line pictograms for the venue's services, drawn on a 32px grid with one stroke weight.
import type { SVGProps } from "react";

export type ServiceIcon =
  | "hall"
  | "table"
  | "chair"
  | "garden"
  | "kitchen"
  | "playground"
  | "balloons"
  | "inflatable";

const paths: Record<ServiceIcon, React.ReactNode> = {
  hall: (
    <>
      <path d="M4 13 16 5l12 8" />
      <path d="M7 13v13M12.5 13v13M19.5 13v13M25 13v13" />
      <path d="M4 26.5h24" />
    </>
  ),
  table: (
    <>
      <ellipse cx="16" cy="11" rx="11" ry="3.5" />
      <path d="M5 11c0 5 1 9 2.5 12M27 11c0 5-1 9-2.5 12" />
      <path d="M10 14.2c.4 3.5 1 6.5 1.8 8.8M22 14.2c-.4 3.5-1 6.5-1.8 8.8" />
      <path d="M16 14.5V27" />
    </>
  ),
  chair: (
    <>
      <path d="M11 4v12h11" />
      <path d="M10 4.5h3" />
      <path d="M11 16 8 28M22 16l3 12M14 16l7 12M19 16l-7 12" />
    </>
  ),
  garden: (
    <>
      <path d="M16 27V16" />
      <path d="M16 16c-5 0-8-3-8-7a8 8 0 0 1 16 0c0 4-3 7-8 7Z" />
      <path d="M4 27h24" />
      <path d="M6 27c0-2.2 1.3-3.5 3-3.5s3 1.3 3 3.5M20 27c0-2.2 1.3-3.5 3-3.5s3 1.3 3 3.5" />
    </>
  ),
  kitchen: (
    <>
      <path d="M6 14h20v9a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-9Z" />
      <path d="M3 14h26" />
      <path d="M12 10c0-2 2-2 2-4M18 10c0-2 2-2 2-4" />
    </>
  ),
  playground: (
    <>
      <path d="M6 27V9h7v18" />
      <path d="M6 9l3.5-4L13 9" />
      <path d="M6 15h7M6 21h7" />
      <path d="M13 12c5 0 6 4 8.5 9.5S25 27 28 27" />
    </>
  ),
  balloons: (
    <>
      <path d="M11 15c-3 0-5-2.6-5-5.6S8 4 11 4s5 2.4 5 5.4S14 15 11 15Z" />
      <path d="M21 17c-3 0-5-2.6-5-5.6S18 6 21 6s5 2.4 5 5.4S24 17 21 17Z" />
      <path d="M11 15c0 4 2 6 4 8s1 4 1 5M21 17c0 3-2 5-4 6.5" />
    </>
  ),
  inflatable: (
    <>
      <path d="M5 27V12h22v15" />
      <path d="M5 12V7h4v5M14 12V7h4v5M23 12V7h4v5" />
      <path d="M13 27v-6a3 3 0 0 1 6 0v6" />
      <path d="M3 27h26" />
    </>
  ),
};

export function ServiceIconSvg({ name, ...props }: { name: ServiceIcon } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
