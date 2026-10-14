type ArrowIconProps = {
  className?: string;
  /** "up-right" matches the CTA arrows, "right" the plain text arrows. */
  direction?: "up-right" | "right";
};

// Path exported from Figma ("Arrow 1"); inline so it inherits `currentColor`.
export function ArrowIcon({ className, direction = "up-right" }: ArrowIconProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 26.4558 14.7279"
      fill="none"
      className={`${direction === "up-right" ? "-rotate-45" : ""} ${className ?? ""}`}
    >
      <path
        d="M26.163 8.07107C26.5535 7.68054 26.5535 7.04738 26.163 6.65685L19.799 0.292893C19.4085 -0.097631 18.7753 -0.097631 18.3848 0.292893C17.9943 0.683418 17.9943 1.31658 18.3848 1.70711L24.0416 7.36396L18.3848 13.0208C17.9943 13.4113 17.9943 14.0445 18.3848 14.435C18.7753 14.8256 19.4085 14.8256 19.799 14.435L26.163 8.07107ZM0 7.36396V8.36396H25.4558V7.36396V6.36396H0V7.36396Z"
        fill="currentColor"
      />
    </svg>
  );
}
