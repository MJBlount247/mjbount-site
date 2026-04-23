"use client";

import { useEffect } from "react";
import styles from "./slide-panel.module.css";

interface SlidePanelProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function SlidePanel({ isOpen, title, onClose, children }: SlidePanelProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
        aria-modal="true"
        role="dialog"
        aria-label={title}
      >
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
            ✕
          </button>
        </div>
        <div className={styles.panelBody}>{isOpen && children}</div>
      </aside>
    </>
  );
}
