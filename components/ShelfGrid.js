"use client";
import ShelfCard from "./ShelfCard";

export default function ShelfGrid({ items, onCardClick, onEdit, onRemove, onManage, onDrop }) {
    if (items.length === 0) {
        return (
            <div className="shelf-grid">
                <div className="shelf-empty">
                    <p className="shelf-empty-text">nothing here!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="shelf-grid">
            {items.map(function(item) {
                return (
                    <ShelfCard
                        key={item.id}
                        item={item}
                        onClick={onCardClick}
                        onEdit={onEdit}
                        onRemove={onRemove}
                        onManage={onManage}
                        onDrop={onDrop}
                    />
                );
            })}
        </div>
    );
}
