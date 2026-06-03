import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 border border-transparent bg-clip-padding font-bold whitespace-nowrap transition-all outline-none select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      // Two content sizes: main (default) + small. Plus icon utilities.
      // Defined before `variant` so the link variant's resets win via cn().
      size: {
        default: "h-12 rounded-xl px-6 text-base",
        sm: "h-9 rounded-lg px-4 text-sm",
        icon: "size-12 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
      },
      variant: {
        // Primary — orange.
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Secondary — black.
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        // Tertiary — outline.
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        // Text link — black, at the button's text size.
        link: "h-auto rounded-none px-0 text-foreground underline-offset-4 hover:underline",
        // Utility only: bare/transparent (icon, back, close, header).
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
