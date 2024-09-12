import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-lifeSavers font-extrabold",
  {
    variants: {
      variant: {
        default: "bg-green text-lightPink hover:bg-lightPink/90 hover:text-green",
        filter:
          "border-2 border-darkPink text-darkPink bg-cream hover:bg-darkPink hover:text-cream",
        secondary:
          "bg-blue text-lightPink hover:bg-lightPink hover:text-blue",
        circle: "bg-darkPink text-cream hover:bg-cream/90 hover:text-darkPink",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-20 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        navbar: "h-10 px-8 py-2",
        circle: "h-12 w-12 rounded-full",
        filter: "rounded-full h-10 px-12",
        responsive: "h-8 px-4 sm:h-9 sm:px-6 md:h-10 md:px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "responsive",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    (<Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />)
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
