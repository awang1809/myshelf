"use client";
import { useRef, useCallback, useEffect } from "react";
import { ratingColor } from "../lib/data";

const SIZES = {
    sm: { width: 44, height: 44, viewBox: "0 0 48 48", r: 21, strokeWidth: 4, fontSize: 13, circumference: 2 * Math.PI * 21, trackClass: "card-wheel-track", fillClass: "card-wheel-fill", valueClass: "card-wheel-value", svgClass: "card-wheel", wrapClass: "card-wheel-wrap" },
    md: { width: 64, height: 64, viewBox: "0 0 48 48", r: 21, strokeWidth: 4, fontSize: 18, circumference: 2 * Math.PI * 21, trackClass: "card-wheel-track", fillClass: "card-wheel-fill", valueClass: "detail-wheel-value", svgClass: "card-wheel", wrapClass: "detail-wheel-wrap" },
    lg: { width: 110, height: 110, viewBox: "0 0 120 120", r: 50, strokeWidth: 7, fontSize: 24, circumference: 2 * Math.PI * 50 },
};

export default function RatingWheel({ value, onChange, size, variant }) {
    const s = SIZES[size] || SIZES.sm;
    const wrapRef = useRef(null);
    const draggingRef = useRef(false);
    const interactive = typeof onChange === "function";

    const fraction = value / 10;
    const offset = s.circumference * (1 - fraction);
    const color = ratingColor(value);

    const angleToRating = useCallback(function(e) {
        if (!wrapRef.current) return;
        const rect = wrapRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        let angle = Math.atan2(e.clientX - cx, -(e.clientY - cy)) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        const rating = Math.round(((angle / 360) * 10) * 10) / 10;
        onChange(Math.max(0, Math.min(10, rating)));
    }, [onChange]);

    useEffect(function() {
        if (!interactive) return;

        function onMouseMove(e) {
            if (draggingRef.current) angleToRating(e);
        }
        function onMouseUp() { draggingRef.current = false; }
        function onTouchMove(e) {
            if (draggingRef.current) angleToRating(e.touches[0]);
        }
        function onTouchEnd() { draggingRef.current = false; }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchmove", onTouchMove, { passive: true });
        window.addEventListener("touchend", onTouchEnd);

        return function() {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [interactive, angleToRating]);

    function handleMouseDown(e) {
        if (!interactive) return;
        draggingRef.current = true;
        angleToRating(e);
    }

    function handleTouchStart(e) {
        if (!interactive) return;
        draggingRef.current = true;
        angleToRating(e.touches[0]);
    }

    // Use appropriate class names based on variant
    if (size === "lg") {
        const isEdit = variant === "edit";
        const wrapClass = isEdit ? "edit-wheel-wrap" : "rating-wheel-wrap";
        const svgClass = isEdit ? "edit-wheel-svg" : "rating-wheel";
        const trackClass = isEdit ? "edit-wheel-track" : "wheel-track";
        const fillClass = isEdit ? "edit-wheel-fill" : "wheel-fill";
        const valueClass = isEdit ? "edit-wheel-value" : "wheel-value";
        const cx = 60, cy = 60;

        return (
            <div className={wrapClass} ref={wrapRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}>
                <svg className={svgClass} viewBox="0 0 120 120" width={110} height={110}>
                    <circle className={trackClass} cx={cx} cy={cy} r={50} />
                    <circle className={fillClass} cx={cx} cy={cy} r={50}
                        style={{ stroke: color, strokeDashoffset: offset }} />
                </svg>
                <div className={valueClass} style={{ color }}>{value.toFixed(1)}</div>
            </div>
        );
    }

    // sm and md variants
    const wrapClass = size === "md" ? "detail-wheel-wrap" : "card-wheel-wrap";
    const cx = 24, cy = 24;

    return (
        <div className={wrapClass} ref={wrapRef}>
            <svg className="card-wheel" viewBox="0 0 48 48" width={s.width} height={s.height}>
                <circle className="card-wheel-track" cx={cx} cy={cy} r={21} />
                <circle className="card-wheel-fill" cx={cx} cy={cy} r={21}
                    style={{ stroke: color, strokeDashoffset: offset }} />
            </svg>
            <div className={size === "md" ? "detail-wheel-value" : "card-wheel-value"}
                style={{ color }}>{value.toFixed(1)}</div>
        </div>
    );
}
