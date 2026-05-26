"use client";
import { ratingColor, formatRating, getItemLabel } from "../lib/data";
import { typeEmoji } from "../lib/constants";
import RatingWheel from "./RatingWheel";

const MINI_CIRCUMFERENCE = 2 * Math.PI * 21;

export default function DetailModal({ item, children, onClose, onNavigate, parentId }) {
    if (!item) return null;

    const isParent = children && children.length > 0;
    const hasBack = !!parentId;

    return (
        <div className={"modal-overlay visible"} onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}>
            <div className={"detail-card" + (isParent ? " has-children" : "")} onClick={function(e) { e.stopPropagation(); }}>
                {hasBack && (
                    <button className="detail-back" onClick={function() { onNavigate(parentId); }}>&#8249;</button>
                )}
                <button className="detail-close" onClick={onClose}>&times;</button>
                <div className="detail-left">
                    <div className="detail-cover-wrap">
                        {item.photo
                            ? <img className="detail-photo" src={item.photo} alt={item.title} />
                            : <span className="detail-emoji">{typeEmoji[item.type]}</span>
                        }
                    </div>
                    <RatingWheel value={item.rating} size="md" />
                </div>
                <div className="detail-middle">
                    <div className="detail-title">{item.title}</div>
                    <span className="detail-type">{getItemLabel(item)}</span>
                    <div className={item.review ? "detail-review" : "detail-review card-review-empty"}>
                        {item.review || "No review"}
                    </div>
                </div>
                {isParent && (
                    <div className="detail-children">
                        {children.map(function(child) {
                            const cColor = ratingColor(child.rating);
                            return (
                                <div key={child.id} className="detail-child" onClick={function() { onNavigate(child.id); }}>
                                    <span className="detail-child-title">{child.title}</span>
                                    <span className="detail-child-rating" style={{ color: cColor }}>{formatRating(child.rating)}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
