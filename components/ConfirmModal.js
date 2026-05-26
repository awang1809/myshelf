"use client";

export default function ConfirmModal({ message, buttons, onClose }) {
    if (!message) return null;

    return (
        <div className="modal-overlay visible" onClick={function(e) { if (e.target === e.currentTarget) onClose(); }}>
            <div className="confirm-card">
                <p className="confirm-message">{message}</p>
                <div className="confirm-actions">
                    {buttons.map(function(btn, i) {
                        return (
                            <button
                                key={i}
                                className={"confirm-btn " + (btn.style || "")}
                                onClick={function() { onClose(); btn.action(); }}
                            >
                                {btn.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
