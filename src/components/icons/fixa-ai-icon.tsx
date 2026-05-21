type Props = React.SVGProps<SVGSVGElement>;

export function FixaAIIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 3 L10.06 7.94 L15 9 L10.06 10.06 L9 15 L7.94 10.06 L3 9 L7.94 7.94 Z" />
      <path d="M19 4 L19.5 6.5 L22 7 L19.5 7.5 L19 10 L18.5 7.5 L16 7 L18.5 6.5 Z" />
      <path d="M19 14 L19.35 15.65 L21 16 L19.35 16.35 L19 18 L18.65 16.35 L17 16 L18.65 15.65 Z" />
    </svg>
  );
}
