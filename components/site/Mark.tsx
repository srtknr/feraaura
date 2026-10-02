export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="11" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="16" cy="16" r="2.2" fill="currentColor" />
    </svg>
  );
}
