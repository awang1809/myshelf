"use client";
import { formatRating } from "../lib/data";

export default function ManageModal({ parent, children, available, onAdd, onRemove, onClose }) {
    if (!parent) return null;

    const childLabel = parent.subtype === "album" ? "songs" : "episodes";
    const childType = parent.subtype === "album" ? "song" : "episode";

    return (
        <div className="modal-overlay visible" onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}>
            <div className="manage-card">
                <h2 className="manage-title">Manage {childLabel}</h2>
                <div className="manage-section">
                    <h3 className="manage-section-title">Current</h3>
                    <div className="manage-list">
                        {children.length === 0 ? (
                            <p className="manage-empty">None yet</p>
                        ) : (
                            children.map(function(child) {
                                return (
                                    <div key={child.id} className="manage-item">
                                        <span className="manage-item-title">{child.title}</span>
                                        <span className="manage-item-rating">{formatRating(child.rating)}</span>
                                        <button className="manage-item-btn manage-remove-btn" onClick={function() { onRemove(child.id); }}>Remove</button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="manage-section">
                    <h3 className="manage-section-title">Available</h3>
                    <div className="manage-list">
                        {available.length === 0 ? (
                            <p className="manage-empty">No standalone {childType}s available</p>
                        ) : (
                            available.map(function(item) {
                                return (
                                    <div key={item.id} className="manage-item">
                                        <span className="manage-item-title">{item.title}</span>
                                        <span className="manage-item-rating">{formatRating(item.rating)}</span>
                                        <button className="manage-item-btn manage-add-btn" onClick={function() { onAdd(item.id); }}>Add</button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                <div className="manage-actions">
                    <button className="edit-save" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
}
