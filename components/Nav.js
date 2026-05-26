"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Nav() {
    const pathname = usePathname();

    return (
        <nav>
            <Link className="nav-logo" href="/">
                <img src="/logo-transparent.png" alt="myShelf" />
            </Link>
            <div className="nav-links">
                <Link href="/home" className={pathname === "/home" ? "nav-active" : ""}>My Shelf</Link>
                <Link href="/rate" className={pathname === "/rate" ? "nav-active" : ""}>Rate</Link>
                <a href="#">Explore</a>
            </div>
        </nav>
    );
}
