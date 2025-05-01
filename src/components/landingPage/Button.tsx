// import * as React from "react"
// import { Slot } from "@radix-ui/react-slot"
// import { cva, type VariantProps } from "class-variance-authority"
// import { cn } from "@/lib/utils"

// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//   {
//     variants: {
//       variant: {
//         default: "bg-decagon-primary text-white hover:bg-decagon-neon focus-visible:ring-decagon-primary",
//         destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
//         outline: "border border-decagon-muted text-decagon-dark hover:bg-decagon-light hover:text-decagon-dark focus-visible:ring-decagon-muted",
//         secondary: "bg-decagon-secondary text-white hover:bg-decagon-accent focus-visible:ring-decagon-secondary",
//         ghost: "hover:bg-decagon-light hover:text-decagon-dark focus-visible:ring-decagon-muted",
//         link: "text-decagon-primary underline-offset-4 hover:underline focus-visible:ring-transparent",
//       },
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   }
// )

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//     VariantProps<typeof buttonVariants> {
//   asChild?: boolean
// }

// const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, variant = "default", size, asChild = false, ...props }, ref) => {
//     const Comp = asChild ? Slot : "button"
//     return (
//       <Comp
//         className={cn(buttonVariants({ variant, size, className }))}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )

// Button.displayName = "Button"

// export { Button, buttonVariants }



import { cn } from "@/lib/utils"; // utility to join classnames (optional)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "outline";
};

export const Button = ({ className, variant = "primary", ...props }: ButtonProps) => {
  const base = "inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ";
  const variants = {
    primary: "bg-decagon-primary text-white hover:bg-decagon-primary/90",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    default: "bg-black text-white hover:bg-gray-800",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
};
