"use client";
import { useState } from "react";
import { ratingColor, formatRating, getItemLabel } from "../lib/data";
import { typeEmoji } from "../lib/constants";

const MINI_CIRCUMFERENCE = 2 * Math.PI * 21;

export default function ShelfCard({ item, onClick, onEdit, onRemove, onManage, onDragStart, onDragOver, onDragLeave, onDrop }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const fraction = item.rating / 10;
    const offset = MINI_CIRCUMFERENCE * (1 - fraction);
    const color = ratingColor(item.rating);

    const isParent = item.children && item.children.length > 0;
    const isStandaloneChild = (item.subtype === "song" || item.subtype === "episode") && !item.parentId;
    const isDropTarget = item.subtype === "album" || item.subtype === "series";

    let badgeHtml = null;
    if (isParent) {
        const childLabel = item.subtype === "album" ? "song" : "episode";
        const count = item.children.length;
        badgeHtml = <span className="card-children-count">{count} {childLabel}{count !== 1 ? "s" : ""}</span>;
    }

    function handleCardClick(e) {
        if (e.target.closest(".card-menu-btn") || e.target.closest(".card-menu")) return;
        onClick(item.id);
    }

    function handleMenuClick(e) {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    }

    function handleEdit(e) {
        e.stopPropagation();
        setMenuOpen(false);
        onEdit(item.id);
    }

    function handleRemove(e) {
        e.stopPropagation();
        setMenuOpen(false);
        onRemove(item.id);
    }

    function handleManage(e) {
        e.stopPropagation();
        setMenuOpen(false);
        onManage(item.id);
    }

    function handleDragStartLocal(e) {
        e.dataTransfer.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.classList.add("dragging");
        if (onDragStart) onDragStart(e, item.id);
    }

    function handleDragOverLocal(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        e.currentTarget.classList.add("drag-over");
    }

    function handleDragLeaveLocal(e) {
        e.currentTarget.classList.remove("drag-over");
    }

    function handleDropLocal(e) {
        e.preventDefault();
        e.currentTarget.classList.remove("drag-over");
        const childId = e.dataTransfer.getData("text/plain");
        if (onDrop) onDrop(childId, item.id);
    }

    const manageLabel = item.subtype === "album" ? "Manage songs" : "Manage episodes";

    return (
        <div
            className="shelf-card"
            data-type={item.type}
            data-id={item.id}
            onClick={handleCardClick}
            draggable={isStandaloneChild ? true : undefined}
            onDragStart={isStandaloneChild ? handleDragStartLocal : undefined}
            onDragOver={isDropTarget ? handleDragOverLocal : undefined}
            onDragLeave={isDropTarget ? handleDragLeaveLocal : undefined}
            onDrop={isDropTarget ? handleDropLocal : undefined}
        >
            <div className="card-left">
                <div className="card-cover">
                    {item.photo
                        ? <img className="card-photo" src={item.photo} alt={item.title} />
                        : <span className="card-emoji">{typeEmoji[item.type]}</span>
                    }
                </div>
                <div className="card-wheel-wrap">
                    <svg className="card-wheel" viewBox="0 0 48 48" width={44} height={44}>
                        <circle className="card-wheel-track" cx={24} cy={24} r={21} />
                        <circle className="card-wheel-fill" cx={24} cy={24} r={21}
                            style={{ stroke: color, strokeDashoffset: offset }} />
                    </svg>
                    <div className="card-wheel-value" style={{ color }}>{formatRating(item.rating)}</div>
                </div>
            </div>
            <div className="card-header">
                <div className="card-header-top">
                    <div>
                        <div className="card-title">{item.title}</div>
                        <span className="card-type">{getItemLabel(item)}</span>
                        {badgeHtml}
                    </div>
                    <button className="card-menu-btn" onClick={handleMenuClick}>&#8943;</button>
                </div>
                <div className="card-menu" style={{ display: menuOpen ? "flex" : "none" }}>
                    {isDropTarget && <button onClick={handleManage}>{manageLabel}</button>}
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleRemove}>Remove</button>
                </div>
            </div>
            <div className={item.review ? "card-review" : "card-review card-review-empty"}>
                {item.review || "No review"}
            </div>
        </div>
    );
}
