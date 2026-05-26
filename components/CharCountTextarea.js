"use client";

export default function CharCountTextarea({ value, onChange, id, groupClass }) {
    const len = value ? value.length : 0;
    const countColor = len >= 1200 ? "#f51414" : "#bbb";

    return (
        <div className={groupClass || "form-group form-group-review"}>
            <label htmlFor={id}>Your Review</label>
            <textarea
                id={id}
                maxLength={1200}
                value={value}
                onChange={function(e) { onChange(e.target.value); }}
            />
            <span className="char-count" style={{ color: countColor }}>{len} / 1200</span>
        </div>
    );
}
