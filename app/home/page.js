"use client";
import { useState, useEffect, useMemo } from "react";
import useCollection from "../../hooks/useCollection";
import ShelfHeader from "../../components/ShelfHeader";
import MediaTabs from "../../components/MediaTabs";
import ShelfGrid from "../../components/ShelfGrid";
import DetailModal from "../../components/DetailModal";
import EditModal from "../../components/EditModal";
import ConfirmModal from "../../components/ConfirmModal";
import ManageModal from "../../components/ManageModal";

export default function HomePage() {
    const {
        items, hydrated, updateItem,
        removeItem, removeItemWithChildren, removeItemKeepChildren,
        addChildToParent, removeChildFromParent,
        getItemById, getChildrenOf,
    } = useCollection();

    const [activeType, setActiveType] = useState("all");
    const [activeSubtype, setActiveSubtype] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("rating");

    // Modal states
    const [detailItemId, setDetailItemId] = useState(null);
    const [editItemId, setEditItemId] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState(null);
    const [manageParentId, setManageParentId] = useState(null);

    // Filtered and sorted items
    const filteredItems = useMemo(function() {
        let result = items.filter(function(item) { return !item.parentId; });
        if (activeType !== "all") {
            result = result.filter(function(item) { return item.type === activeType; });
        }
        if (activeSubtype) {
            result = result.filter(function(item) { return item.subtype === activeSubtype; });
        }
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            result = result.filter(function(item) {
                return item.title.toLowerCase().includes(q);
            });
        }
        if (sortBy === "rating") {
            result.sort(function(a, b) { return b.rating - a.rating; });
        } else if (sortBy === "title") {
            result.sort(function(a, b) { return a.title.localeCompare(b.title); });
        }
        return result;
    }, [items, activeType, activeSubtype, searchQuery, sortBy]);

    // Close menus on outside click
    useEffect(function() {
        function handleDragEnd() {
            const el = document.querySelector(".dragging");
            if (el) el.classList.remove("dragging");
        }
        document.addEventListener("dragend", handleDragEnd);
        return function() { document.removeEventListener("dragend", handleDragEnd); };
    }, []);

    function handleTypeChange(type) {
        setActiveType(type);
        setActiveSubtype(null);
    }

    function handleSubtypeChange(type, subtype) {
        setActiveType(type);
        setActiveSubtype(subtype);
    }

    // Card click → detail modal
    function handleCardClick(itemId) {
        setDetailItemId(itemId);
    }

    // Detail modal navigation
    function handleDetailNavigate(itemId) {
        setDetailItemId(itemId);
    }

    // Edit
    function handleEdit(itemId) {
        setEditItemId(itemId);
    }

    function handleEditSave(id, updates) {
        updateItem(id, updates);
    }

    // Remove
    function handleRemove(itemId) {
        const item = getItemById(itemId);
        if (!item) return;

        const isParent = item.children && item.children.length > 0;

        if (isParent) {
            const childLabel = item.subtype === "album" ? "songs" : "episodes";
            setConfirmConfig({
                message: "\"" + item.title + "\" has " + item.children.length + " " + childLabel + ". What would you like to do?",
                buttons: [
                    { label: "Cancel", style: "confirm-cancel", action: function() {} },
                    {
                        label: "Keep " + childLabel,
                        style: "confirm-keep",
                        action: function() { removeItemKeepChildren(itemId); }
                    },
                    {
                        label: "Delete all",
                        style: "confirm-danger",
                        action: function() { removeItemWithChildren(itemId); }
                    }
                ]
            });
        } else {
            setConfirmConfig({
                message: "Remove \"" + item.title + "\"? This cannot be undone.",
                buttons: [
                    { label: "Cancel", style: "confirm-cancel", action: function() {} },
                    {
                        label: "Remove",
                        style: "confirm-danger",
                        action: function() { removeItem(itemId); }
                    }
                ]
            });
        }
    }

    // Manage modal
    function handleManage(parentId) {
        setManageParentId(parentId);
    }

    function handleManageAdd(childId) {
        addChildToParent(childId, manageParentId);
    }

    function handleManageRemove(childId) {
        removeChildFromParent(childId, manageParentId);
    }

    // Drag and drop
    function handleDrop(childId, parentId) {
        if (!childId || !parentId || childId === parentId) return;
        const child = getItemById(childId);
        const parent = getItemById(parentId);
        if (!child || !parent) return;

        if (child.subtype === "song" && parent.subtype !== "album") return;
        if (child.subtype === "episode" && parent.subtype !== "series") return;
        if (child.subtype !== "song" && child.subtype !== "episode") return;

        addChildToParent(childId, parentId);
    }

    if (!hydrated) return null;

    // Prepare modal data
    const detailItem = detailItemId ? getItemById(detailItemId) : null;
    const detailChildren = detailItem ? getChildrenOf(detailItemId) : [];
    const editItem = editItemId ? getItemById(editItemId) : null;

    const manageParent = manageParentId ? getItemById(manageParentId) : null;
    const manageChildren = manageParent ? getChildrenOf(manageParentId) : [];
    const manageAvailable = manageParent ? (function() {
        const childType = manageParent.subtype === "album" ? "song" : "episode";
        return items.filter(function(i) {
            return i.type === manageParent.type && i.subtype === childType && !i.parentId;
        });
    })() : [];

    return (
        <div className="page-content">
            <ShelfHeader count={filteredItems.length} sortBy={sortBy} onSortChange={setSortBy} />
            <MediaTabs
                activeType={activeType}
                activeSubtype={activeSubtype}
                searchQuery={searchQuery}
                onTypeChange={handleTypeChange}
                onSubtypeChange={handleSubtypeChange}
                onSearchChange={setSearchQuery}
            />
            <ShelfGrid
                items={filteredItems}
                onCardClick={handleCardClick}
                onEdit={handleEdit}
                onRemove={handleRemove}
                onManage={handleManage}
                onDrop={handleDrop}
            />

            {detailItem && (
                <DetailModal
                    item={detailItem}
                    children={detailChildren}
                    parentId={detailItem.parentId}
                    onClose={function() { setDetailItemId(null); }}
                    onNavigate={handleDetailNavigate}
                />
            )}

            {editItem && (
                <EditModal
                    item={editItem}
                    onSave={handleEditSave}
                    onClose={function() { setEditItemId(null); }}
                />
            )}

            {confirmConfig && (
                <ConfirmModal
                    message={confirmConfig.message}
                    buttons={confirmConfig.buttons}
                    onClose={function() { setConfirmConfig(null); }}
                />
            )}

            {manageParent && (
                <ManageModal
                    parent={manageParent}
                    children={manageChildren}
                    available={manageAvailable}
                    onAdd={handleManageAdd}
                    onRemove={handleManageRemove}
                    onClose={function() { setManageParentId(null); }}
                />
            )}
        </div>
    );
}
