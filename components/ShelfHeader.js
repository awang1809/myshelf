"use client";

export default function ShelfHeader({ count, sortBy, onSortChange }) {
    let suffix = "";
    if (count !== 1) suffix = "s";

    return (
        <header className="shelf-header">
            <div className="shelf-header-left">
                <h1 className="shelf-title">My Shelf</h1>
                <p className="shelf-count">{count} item{suffix}</p>
            </div>
            <div className="shelf-controls">
                <label className="sort-label" htmlFor="sort-select">Sort by</label>
                <select
                    id="sort-select"
                    className="sort-select"
                    value={sortBy}
                    onChange={function(e) { onSortChange(e.target.value); }}
                >
                    <option value="rating">Rating</option>
                    <option value="title">Title</option>
                </select>
            </div>
        </header>
    );
}
