//CREDIT: https://codepen.io/KenLewis/pen/VwKWzEZ

export function getTextColorFromBackgroundColor(backgroundHex) {

    let hex = backgroundHex.substring(1,7);
    let r = parseInt(hex.slice(0,2), 16),
        g = parseInt(hex.slice(2,4), 16),
        b = parseInt(hex.slice(4,6), 16);

    return ((r * 0.299 + g * 0.587 + b * 0.114) > 125) ? 'black' : 'white'
}