/**
 * Utils
 * @module utils
 */
module.exports = {
    /**
    * @typedef {Object} Point
    * @property {number} x - Coordenada x
    * @property {number} y - Coordenada y
    */
    /**
     * Distancia entre punto origen {x: 0, y: 0} a otro punto
     * @param {Point} coords Coordenadas punto destino
     * 
     * @return {number} Distancia al punto destino
     */
    coordsDistance(coords) {
        const a = coords.x;
        const b = coords.y;

        return Math.sqrt(a * a + b * b);
    }
};
