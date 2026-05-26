import "./globals.css";
import "../css/home.css";
import "../css/rate.css";
import Nav from "../components/Nav";

export const metadata = {
    title: "myShelf",
    description: "Rate, review, and organize your media collection",
    icons: {
        icon: "/favicon.svg",
        apple: "/favicon.svg",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Nav />
                {children}
            </body>
        </html>
    );
}
