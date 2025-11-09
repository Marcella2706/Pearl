import Link, { LinkProps } from "next/link";
import { forwardRef, useTransition, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<LinkProps, "className"> {
    className?: string;
    activeClassName?: string;
    pendingClassName?: string;
    children?: ReactNode;
    to?: LinkProps["href"];
    match?: "exact" | "partial";
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
    (
        {
            className,
            activeClassName,
            pendingClassName,
            to,
            href,
            children,
            match = "partial",
            ...props
        },
        ref,
    ) => {
        const pathname = usePathname() || "/";
        const [isPending] = useTransition();

        const target = (to ?? href) as string | URL | undefined;
        const targetPath =
            typeof target === "string"
                ? target
                : target instanceof URL
                ? target.pathname
                : "";

        const isActive =
            match === "exact" ? pathname === targetPath : pathname.startsWith(targetPath);

        return (
            <Link href={to ?? href ?? "/"} {...props} legacyBehavior>
                <a
                    ref={ref}
                    className={cn(className, isActive && activeClassName, isPending && pendingClassName)}
                >
                    {children}
                </a>
            </Link>
        );
    },
);

NavLink.displayName = "NavLink";

export { NavLink };
