"use client";
import { useState, useEffect } from "react";
import RatingWheel from "./RatingWheel";
import PhotoUpload from "./PhotoUpload";
import CharCountTextarea from "./CharCountTextarea";

export default function EditModal({ item, onSave, onClose }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [subtype, setSubtype] = useState(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [photoData, setPhotoData] = useState(null);

    useEffect(function() {
        if (item) {
            setName(item.title);
            setCategory(item.type);
            setSubtype(item.subtype || null);
            setRating(item.rating);
            setReview(item.review || "");
            setPhotoData(item.photo || null);
        }
    }, [item]);

    if (!item) return null;

    const showSubtype = category === "music" || category === "tv";
    const subtypeOptions = category === "music"
        ? [{ value: "album", label: "Album" }, { value: "song", label: "Song" }]
        : [{ value: "series", label: "Series" }, { value: "episode", label: "Episode" }];

    function handleSubmit(e) {
        e.preventDefault();
        const updates = {
            title: name.trim(),
            type: category,
            rating: rating,
            review: review.trim(),
            photo: photoData,
        };
        if (showSubtype) {
            updates.subtype = subtype;
        }
        onSave(item.id, updates);
        onClose();
    }

    return (
        <div className="modal-overlay visible" onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}>
            <div className="edit-card">
                <form className="edit-form" onSubmit={handleSubmit}>
                    <div className="edit-left">
                        <PhotoUpload value={photoData} onChange={setPhotoData} variant="edit" />
                        <RatingWheel value={rating} onChange={setRating} size="lg" variant="edit" />
                    </div>
                    <div className="edit-right">
                        <div className="edit-field">
                            <label htmlFor="edit-name">Name</label>
                            <input
                                type="text"
                                id="edit-name"
                                required
                                value={name}
                                onChange={function(e) { setName(e.target.value); }}
                            />
                        </div>
                        <div className="edit-field">
                            <label htmlFor="edit-category">Category</label>
                            <select
                                id="edit-category"
                                required
                                value={category}
                                onChange={function(e) {
                                    setCategory(e.target.value);
                                    if (e.target.value === "music") setSubtype("album");
                                    else if (e.target.value === "tv") setSubtype("series");
                                    else setSubtype(null);
                                }}
                            >
                                <option value="movie">🎬 Movie</option>
                                <option value="game">🎮 Game</option>
                                <option value="music">🎵 Music</option>
                                <option value="tv">📺 TV</option>
                                <option value="book">📚 Book</option>
                            </select>
                        </div>
                        {showSubtype && (
                            <div className="edit-field">
                                <label htmlFor="edit-subtype">Type</label>
                                <select
                                    id="edit-subtype"
                                    value={subtype || subtypeOptions[0].value}
                                    onChange={function(e) { setSubtype(e.target.value); }}
                                >
                                    {subtypeOptions.map(function(opt) {
                                        return <option key={opt.value} value={opt.value}>{opt.label}</option>;
                                    })}
                                </select>
                            </div>
                        )}
                        <CharCountTextarea
                            value={review}
                            onChange={setReview}
                            id="edit-review"
                            groupClass="edit-field edit-field-review"
                        />
                        <div className="edit-actions">
                            <button type="button" className="edit-discard" onClick={onClose}>Discard Changes</button>
                            <button type="submit" className="edit-save">Save Changes</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
