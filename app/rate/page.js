"use client";
import { useState } from "react";
import useCollection from "../../hooks/useCollection";
import RatingWheel from "../../components/RatingWheel";
import PhotoUpload from "../../components/PhotoUpload";
import CharCountTextarea from "../../components/CharCountTextarea";
import CategorySelect from "../../components/CategorySelect";
import Toast from "../../components/Toast";
import { generateId } from "../../lib/data";

export default function RatePage() {
    const { items, hydrated, addItem, save } = useCollection();

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [subtype, setSubtype] = useState(null);
    const [parentId, setParentId] = useState("");
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [photoData, setPhotoData] = useState(null);
    const [showToast, setShowToast] = useState(false);

    function handleCategoryChange(val) {
        setCategory(val);
        if (val === "music") {
            setSubtype("album");
        } else if (val === "tv") {
            setSubtype("series");
        } else {
            setSubtype(null);
        }
        setParentId("");
    }

    function handleSubtypeChange(val) {
        setSubtype(val);
        setParentId("");
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim() || !category) return;

        const newItem = {
            title: name.trim(),
            type: category,
            rating: rating,
            review: review.trim(),
            photo: photoData,
            id: generateId(),
            subtype: (category === "music" || category === "tv") ? subtype : null,
            children: [],
            parentId: parentId || null,
        };

        if (parentId) {
            const allItems = [...items, newItem];
            const updated = allItems.map(function(item) {
                if (item.id === parentId) {
                    return { ...item, children: [...item.children, newItem.id] };
                }
                return item;
            });
            save(updated);
        } else {
            addItem(newItem);
        }

        // Show toast
        setShowToast(true);
        setTimeout(function() { setShowToast(false); }, 2500);

        // Reset form
        setName("");
        setCategory("");
        setSubtype(null);
        setParentId("");
        setRating(5);
        setReview("");
        setPhotoData(null);
    }

    if (!hydrated) return null;

    return (
        <>
            <div className="rate-page">
                <div className="rate-card">
                    <form className="rate-form" onSubmit={handleSubmit}>
                        <div className="card-left">
                            <PhotoUpload value={photoData} onChange={setPhotoData} />
                            <RatingWheel value={rating} onChange={setRating} size="lg" />
                        </div>
                        <div className="card-right">
                            <div className="form-group">
                                <label htmlFor="item-name">Name</label>
                                <input
                                    type="text"
                                    id="item-name"
                                    required
                                    value={name}
                                    onChange={function(e) { setName(e.target.value); }}
                                />
                            </div>

                            <CategorySelect
                                category={category}
                                subtype={subtype}
                                parentId={parentId}
                                onCategoryChange={handleCategoryChange}
                                onSubtypeChange={handleSubtypeChange}
                                onParentChange={setParentId}
                                items={items}
                                showParentPicker={true}
                            />

                            <CharCountTextarea
                                value={review}
                                onChange={setReview}
                                id="item-review"
                            />

                            <button type="submit" className="rate-submit">Add to Shelf</button>
                        </div>
                    </form>
                </div>
            </div>
            <Toast show={showToast} />
        </>
    );
}
