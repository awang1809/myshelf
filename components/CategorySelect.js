"use client";

export default function CategorySelect({ category, subtype, parentId, onCategoryChange, onSubtypeChange, onParentChange, items, showParentPicker, groupClass }) {
    const gc = groupClass || "form-group";

    const showSubtype = category === "music" || category === "tv";
    const subtypeOptions = category === "music"
        ? [{ value: "album", label: "Album" }, { value: "song", label: "Song" }]
        : [{ value: "series", label: "Series" }, { value: "episode", label: "Episode" }];

    const showParent = showParentPicker && (subtype === "song" || subtype === "episode");
    const parentType = subtype === "song" ? "music" : "tv";
    const parentSubtype = subtype === "song" ? "album" : "series";
    const parentOptions = items
        ? items.filter(function(i) { return i.type === parentType && i.subtype === parentSubtype; })
        : [];

    return (
        <>
            <div className={gc}>
                <label htmlFor="item-category">Category</label>
                <select
                    id="item-category"
                    required
                    value={category}
                    onChange={function(e) { onCategoryChange(e.target.value); }}
                >
                    <option value="" disabled>Choose a category</option>
                    <option value="movie">🎬 Movie</option>
                    <option value="game">🎮 Game</option>
                    <option value="music">🎵 Music</option>
                    <option value="tv">📺 TV</option>
                    <option value="book">📚 Book</option>
                </select>
            </div>

            {showSubtype && (
                <div className={gc}>
                    <label htmlFor="item-subtype">Type</label>
                    <select
                        id="item-subtype"
                        value={subtype || subtypeOptions[0].value}
                        onChange={function(e) { onSubtypeChange(e.target.value); }}
                    >
                        {subtypeOptions.map(function(opt) {
                            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                        })}
                    </select>
                </div>
            )}

            {showParent && (
                <div className={gc}>
                    <label htmlFor="item-parent">Belongs to</label>
                    <select
                        id="item-parent"
                        value={parentId || ""}
                        onChange={function(e) { onParentChange(e.target.value); }}
                    >
                        <option value="">None (standalone)</option>
                        {parentOptions.map(function(p) {
                            return <option key={p.id} value={p.id}>{p.title}</option>;
                        })}
                    </select>
                </div>
            )}
        </>
    );
}
