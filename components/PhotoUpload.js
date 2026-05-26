"use client";
import { useRef } from "react";
import { compressImage } from "../lib/data";

export default function PhotoUpload({ value, onChange, variant }) {
    const inputRef = useRef(null);
    const isEdit = variant === "edit";

    function handleClick() {
        inputRef.current.click();
    }

    function handleChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(ev) {
            compressImage(ev.target.result).then(function(compressed) {
                onChange(compressed);
            });
        };
        reader.readAsDataURL(file);
        // Reset so same file can be selected again
        e.target.value = "";
    }

    const wrapClass = isEdit ? "edit-photo-upload" : "photo-upload";
    const circleClass = isEdit ? "edit-photo-circle" : "photo-circle";
    const imgClass = isEdit ? "edit-photo-circle-img" : "photo-circle-img";
    const placeholderClass = isEdit ? "edit-photo-placeholder" : "photo-placeholder";

    return (
        <div className={wrapClass} onClick={handleClick}>
            <input type="file" ref={inputRef} accept="image/*" hidden onChange={handleChange} />
            {value ? (
                <img className={imgClass + " visible"} src={value} alt="Cover preview" />
            ) : (
                <div className={circleClass}>
                    <span className={placeholderClass}>+</span>
                </div>
            )}
        </div>
    );
}
