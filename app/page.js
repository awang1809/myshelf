import Link from "next/link";

export default function LandingPage() {
    return (
        <>
            <div className="page-content">
                <section className="hero">
                    <h1 className="hero-title">Shelve <em>every</em> experience.</h1>
                    <p className="hero-subtitle">
                        Every movie, every album, every game.<br />
                        Log, rate, and remember everything you{"'"}ve watched, read, and played all in one place.
                    </p>
                    <Link className="hero-btn" href="/home">Start your collection</Link>
                </section>

                <div className="media-types">
                    <div className="media-type"><span className="media-icon">🎬</span><span className="media-label">Movies</span></div>
                    <div className="media-type"><span className="media-icon">🎮</span><span className="media-label">Games</span></div>
                    <div className="media-type"><span className="media-icon">🎵</span><span className="media-label">Music</span></div>
                    <div className="media-type"><span className="media-icon">📺</span><span className="media-label">TV</span></div>
                    <div className="media-type"><span className="media-icon">📚</span><span className="media-label">Books</span></div>
                </div>

                <div className="features">
                    <div className="feature">
                        <div className="feature-num">01:</div>
                        <div className="feature-title">One shelf, all media</div>
                        <div className="feature-desc">Movies, games, music, TV, — your entire media life in a single clean place.</div>
                    </div>
                    <div className="feature">
                        <div className="feature-num">02:</div>
                        <div className="feature-title">Rate &amp; remember</div>
                        <div className="feature-desc">Log what you{"'"}ve finished, give a rating, and never forget your thoughts and emotions.</div>
                    </div>
                    <div className="feature">
                        <div className="feature-num">03:</div>
                        <div className="feature-title">Share your taste</div>
                        <div className="feature-desc">Build lists, follow friends, and discover new gems.</div>
                    </div>
                </div>
            </div>

            <footer>
                <span className="footer-logo">
                    <img src="/logo-transparent.png" alt="myShelf" />
                </span>
                <span className="footer-text">Collect Anything</span>
            </footer>
        </>
    );
}
