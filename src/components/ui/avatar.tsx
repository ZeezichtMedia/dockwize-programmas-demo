"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, initials } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex size-9 shrink-0 overflow-hidden rounded-full bg-[var(--color-surface-2)]",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & { name?: string }
>(({ className, name, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center bg-[var(--color-surface-2)] text-[11px] font-semibold uppercase text-[var(--color-ink-2)]",
      className
    )}
    {...props}
  >
    {children ?? (name ? initials(name) : null)}
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface UserAvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  ring?: boolean;
}

const sizeMap = {
  xs: "size-6 text-[9px]",
  sm: "size-8 text-[10px]",
  md: "size-9 text-[11px]",
  lg: "size-12 text-sm",
  xl: "size-16 text-base",
};

const UserAvatar = ({ src, name, size = "md", className, ring }: UserAvatarProps) => (
  <Avatar
    className={cn(
      sizeMap[size],
      ring && "ring-2 ring-white shadow-[var(--shadow-sm)]",
      className
    )}
  >
    {src && <AvatarImage src={src} alt={name} />}
    <AvatarFallback name={name} />
  </Avatar>
);

export { Avatar, AvatarImage, AvatarFallback, UserAvatar };
