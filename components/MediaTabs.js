"use client";

export default function MediaTabs({ activeType, activeSubtype, searchQuery, onTypeChange, onSubtypeChange, onSearchChange }) {
    const mainTabs = [
        { type: "all", label: "All" },
        { type: "movie", label: "🎬 Movies" },
        { type: "game", label: "🎮 Games" },
        { type: "music", label: "🎵 Music" },
        { type: "tv", label: "📺 TV" },
        { type: "book", label: "📚 Books" },
    ];

    const showSubtabs = activeType === "music" || activeType === "tv";
    const subtabs = activeType === "music"
        ? [{ subtype: "album", label: "Albums" }, { subtype: "song", label: "Songs" }]
        : [{ subtype: "series", label: "Series" }, { subtype: "episode", label: "Episodes" }];

    return (
        <>
            <div className="media-tabs">
                <div className="media-tabs-left">
                    {mainTabs.map(function(tab) {
                        return (
                            <button
                                key={tab.type}
                                className={"media-tab" + (activeType === tab.type ? " active" : "")}
                                onClick={function() { onTypeChange(tab.type); }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search your shelf..."
                    value={searchQuery}
                    onChange={function(e) { onSearchChange(e.target.value); }}
                />
            </div>
            {showSubtabs && (
                <div className="media-subtabs">
                    {subtabs.map(function(tab) {
                        return (
                            <button
                                key={tab.subtype}
                                className={"media-tab media-subtab" + (activeSubtype === tab.subtype ? " active" : "")}
                                onClick={function() { onSubtypeChange(activeType, tab.subtype); }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </>
    );
}
