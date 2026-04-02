/**
 * This file replaces individual base64 SVG strings with coordinates for the 
 * unified sprite-sheet: public/textures/icons.png (320x240, 4 columns x 3 rows).
 */

const iconGrid = {
    lightning: { row: 1, col: 1 },
    slide: { row: 1, col: 2 },
    bulb: { row: 1, col: 3 },
    blackhole: { row: 1, col: 4 },
    heart: { row: 2, col: 1 },
    punch: { row: 2, col: 2 },
    btc: { row: 2, col: 3 },
    eth: { row: 2, col: 4 },
    computer: { row: 3, col: 1 },
    lamp: { row: 3, col: 2 },
    eye: { row: 3, col: 3 },
    alert: { row: 3, col: 4 }
};

// Exports for all use cases (matching existing variable names)
export const lightning = iconGrid.lightning;
export const slide = iconGrid.slide;
export const bulb = iconGrid.bulb;
export const blackhole = iconGrid.blackhole;
export const punch = iconGrid.punch;
export const heart = iconGrid.heart;
export const btc = iconGrid.btc;
export const eth = iconGrid.eth;

// Additional icons from the third row
export const computer = iconGrid.computer;
export const lamp = iconGrid.lamp;
export const eye = iconGrid.eye;
export const alert = iconGrid.alert;

