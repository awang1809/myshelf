"use client";

export default function Toast({ show, message }) {
    return (
        <div className={"toast" + (show ? " show" : "")}>
            {message || "Added to your shelf!"}
        </div>
    );
}
