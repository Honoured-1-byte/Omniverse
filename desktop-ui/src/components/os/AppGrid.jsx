import React, { useState, useRef, useEffect } from 'react';
import { HARBOR_APPS } from '../../config/harborRegistry.jsx';
import useOS from '../../hooks/useOS';
import { motion, useDragControls } from 'framer-motion';

// Grid Configuration
const ROWS = 5;  // 5 Rows for more breathing room
const MIN_CELL_W = 120; // Minimum width to prevent overlap

const AppGrid = () => {
    const { openWindow } = useOS();
    const containerRef = useRef(null);
    const [gridState, setGridState] = useState({});
    const [dimensions, setDimensions] = useState({ width: 0, height: 0, cellW: 0, cellH: 0, cols: 12 });
    const gridRef = useRef({}); // Ref for event access

    // 1. Calculate Grid Dimensions on Mount/Resize
    useEffect(() => {
        const updateDimensions = () => {
            if (!containerRef.current) return;
            const { clientWidth, clientHeight } = containerRef.current;

            // Calculate number of columns that fit with minimum width
            const calculatedCols = Math.floor(clientWidth / MIN_CELL_W);
            const safeCols = Math.max(4, calculatedCols); // Ensure at least 4 cols

            // Calculate exact cell size
            const cellW = clientWidth / safeCols;
            const cellH = clientHeight / ROWS;

            setDimensions({ width: clientWidth, height: clientHeight, cellW, cellH, cols: safeCols });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // 2. Initialize App Positions (Column-Major Filling)
    useEffect(() => {
        const initialGrid = {};
        HARBOR_APPS.forEach((app, i) => {
            const col = Math.floor(i / ROWS);
            const row = i % ROWS;
            initialGrid[app.id] = { col, row };
        });
        setGridState(initialGrid);
        gridRef.current = initialGrid;
    }, []);

    // Sync Ref
    useEffect(() => {
        gridRef.current = gridState;
    }, [gridState]);


    // 3. Helper: Get Center Pixel of a Grid Cell
    const getCellCenter = (col, row) => {
        if (!dimensions.cellW) return { x: 0, y: 0 };
        const x = (col * dimensions.cellW) + (dimensions.cellW / 2);
        const y = (row * dimensions.cellH) + (dimensions.cellH / 2);

        // We need top-left of the ICON (96x112ish) to be centered on that point
        const iconW = 96;
        const iconH = 112;

        return {
            x: x - (iconW / 2),
            y: y - (iconH / 2)
        };
    };

    // 4. Handle Drag End with Strict Snap
    const onDragEnd = (draggedId, info) => {
        const currentGrid = gridRef.current;
        const startGridPos = currentGrid[draggedId];
        if (!startGridPos) return;

        // Calculate Drop Target based on Pointer Position relative to Container
        const containerRect = containerRef.current.getBoundingClientRect();
        const relativeX = info.point.x - containerRect.left;
        const relativeY = info.point.y - containerRect.top;

        const targetCol = Math.floor(relativeX / dimensions.cellW);
        const targetRow = Math.floor(relativeY / dimensions.cellH);

        // Bounds Check using dynamic dimensions.cols
        const clampedCol = Math.max(0, Math.min(targetCol, dimensions.cols - 1));
        const clampedRow = Math.max(0, Math.min(targetRow, ROWS - 1));

        // Check Occupancy
        const occupiedEntry = Object.entries(currentGrid).find(([key, pos]) =>
            pos.col === clampedCol && pos.row === clampedRow && key !== draggedId
        );

        const newGrid = { ...currentGrid };

        if (occupiedEntry) {
            // Swap
            const [occupiedId] = occupiedEntry;
            newGrid[draggedId] = { col: clampedCol, row: clampedRow };
            newGrid[occupiedId] = { col: startGridPos.col, row: startGridPos.row };
        } else {
            // Move
            newGrid[draggedId] = { col: clampedCol, row: clampedRow };
        }

        setGridState(newGrid);
    };

    return (
        <div ref={containerRef} className="relative w-full h-[calc(100vh-100px)] overflow-hidden">

            {/* ICONS */}
            {HARBOR_APPS.map(app => {
                const gridPos = gridState[app.id] || { col: 0, row: 0 };
                const pxPos = getCellCenter(gridPos.col, gridPos.row);

                return (
                    <motion.div
                        key={app.id}
                        // Always animate to calculated pixel position.
                        // Drag gesture overrides x/y during interaction.
                        // On release, spring animation snaps to new pxPos.
                        animate={{ x: pxPos.x, y: pxPos.y }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}

                        drag
                        dragMomentum={false}
                        whileDrag={{ scale: 1.1, zIndex: 100 }}

                        onDragStart={() => {
                            window.shift_drag_active = true;
                        }}
                        onDragEnd={(e, info) => onDragEnd(app.id, info)}

                        onClick={() => {
                            if (!window.shift_drag_active) openWindow(app);
                            window.shift_drag_active = false;
                        }}

                        className="absolute top-0 left-0 w-24 h-28 flex flex-col items-center justify-center gap-2 p-2 rounded-xl cursor-pointer group hover:bg-white/10 z-10 transition-colors"
                    >
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/10 text-white group-hover:border-cyan-400/30 group-hover:shadow-cyan-500/20 group-hover:bg-white/20 pointer-events-none select-none">
                            {React.cloneElement(app.icon, { size: 28 })}
                        </div>
                        <span className="text-[11px] font-medium text-white/80 group-hover:text-white leading-tight text-center drop-shadow-md bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm border border-transparent group-hover:border-white/10 line-clamp-2 w-full pointer-events-none select-none">
                            {app.title}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default AppGrid;
