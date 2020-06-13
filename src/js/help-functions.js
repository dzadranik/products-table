export const getCoords = elem => {
    let box = elem.getBoundingClientRect();

    return {
        top: box.top + box.height + pageYOffset + 'px',
        left: box.left + box.width / 2 + pageXOffset + 'px'
    };
}