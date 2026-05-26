"use client";
import { useState, useEffect, useCallback } from "react";
import { migrateItemsArray, generateId } from "../lib/data";

const STORAGE_KEY = "myshelf-user-items";

export default function useCollection() {
    const [items, setItems] = useState([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(function() {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = JSON.parse(raw || "[]");
        const result = migrateItemsArray(parsed);
        if (result.changed) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(result.items));
        }
        setItems(result.items);
        setHydrated(true);
    }, []);

    const save = useCallback(function(newItems) {
        setItems(newItems);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    }, []);

    const addItem = useCallback(function(item) {
        setItems(function(prev) {
            const newItems = [...prev, item];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        });
    }, []);

    const updateItem = useCallback(function(id, updates) {
        setItems(function(prev) {
            const newItems = prev.map(function(item) {
                if (item.id === id) {
                    return { ...item, ...updates };
                }
                return item;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        });
    }, []);

    const removeItem = useCallback(function(id) {
        setItems(function(prev) {
            const item = prev.find(function(i) { return i.id === id; });
            if (!item) return prev;

            let newItems = [...prev];

            // If child, remove from parent's children array
            if (item.parentId) {
                newItems = newItems.map(function(i) {
                    if (i.id === item.parentId) {
                        return { ...i, children: i.children.filter(function(cid) { return cid !== id; }) };
                    }
                    return i;
                });
            }

            newItems = newItems.filter(function(i) { return i.id !== id; });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        });
    }, []);

    const removeItemWithChildren = useCallback(function(id) {
        setItems(function(prev) {
            const item = prev.find(function(i) { return i.id === id; });
            if (!item) return prev;
            const childIds = item.children ? item.children.slice() : [];
            const newItems = prev.filter(function(i) {
                return i.id !== id && childIds.indexOf(i.id) === -1;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        });
    }, []);

    const removeItemKeepChildren = useCallback(function(id) {
        setItems(function(prev) {
            let newItems = prev.map(function(i) {
                if (i.parentId === id) {
                    return { ...i, parentId: null };
                }
                return i;
            });
            newItems = newItems.filter(function(i) { return i.id !== id; });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        });
    }, []);

    const addChildToParent = useCallback(function(childId, parentId) {
        setItems(function(prev) {
            const newItems = prev.map(function(item) {
                if (item.id === childId) {
                    return { ...item, parentId: parentId };
                }
                if (item.id === parentId) {
                    if (item.children.indexOf(childId) === -1) {
                        return { ...item, children: [...item.children, childId] };
                    }
                }
                return item;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        });
    }, []);

    const removeChildFromParent = useCallback(function(childId, parentId) {
        setItems(function(prev) {
            const newItems = prev.map(function(item) {
                if (item.id === childId) {
                    return { ...item, parentId: null };
                }
                if (item.id === parentId) {
                    return { ...item, children: item.children.filter(function(cid) { return cid !== childId; }) };
                }
                return item;
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
            return newItems;
        });
    }, []);

    const getItemById = useCallback(function(id) {
        return items.find(function(i) { return i.id === id; }) || null;
    }, [items]);

    const getChildrenOf = useCallback(function(parentId) {
        return items.filter(function(i) { return i.parentId === parentId; });
    }, [items]);

    return {
        items,
        hydrated,
        save,
        addItem,
        updateItem,
        removeItem,
        removeItemWithChildren,
        removeItemKeepChildren,
        addChildToParent,
        removeChildFromParent,
        getItemById,
        getChildrenOf,
    };
}
