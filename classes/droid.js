const utils = require('../utils');
/**
    * @typedef {Object} Point
    * @property {number} x - Coordenada x
    * @property {number} y - Coordenada y
*/
/**
    * @typedef {Object} ScanData
    * @property {Point} order.scan.coordinates Coordenadas del punto
    * @property {number} [order.scan.distance] Distancia del punto
    * @property {Object} order.scan.enemies Datos de enemigos
    * @property {string} order.scan.enemies.type Tipo de enemigo [soldier, mech]
    * @property {number} order.scan.enemies.number Número de enemigos
    * @property {number} [order.scan.allies] Numero de aliados
*/
class Droid {
    /**
     * Crear un droide
     */
    constructor() {
    }

    /**
     * Procesa datos del módulo de visión
     * @param {Object} order Información recibida de módulo de visión y protocolos a seguir
     * @param {string[]} order.protocols Protocolos [closest-enemies, furthest-enemies, assist-allies, avoid-crossfire, prioritize-mech, avoid-mech]
     * @param {ScanData[]} order.scan Datos de módulo de visión
     * @return {Point} Coordenadas de ataque
     */
    processData(order) {
        const { protocols } = order;
        let { scan } = order;
        let coords = { x: 0, y: 0 };
        scan = this.#addPointsDistance(scan);
        if (protocols.includes('closest-enemies')) {
            scan = this.#closestEnemies(scan);
        }
        else if (protocols.includes('furthest-enemies')) {
            scan = this.#furthestEnemies(scan);
        }
        if (protocols.includes('assist-allies')) {
            scan = this.#assistAllies(scan);
        }
        else if (protocols.includes('avoid-crossfire')) {
            scan = this.#avoidCrossfire(scan);
        }
        if (protocols.includes('prioritize-mech')) {
            scan = this.#prioritizeMech(scan);
        }
        else if (protocols.includes('avoid-mech')) {
            scan = this.#avoidMech(scan);
        }
        if (scan.length > 0) {
            coords = scan[0].coordinates;
        }

        return coords;
    }

    /**
     * Priorizar el punto más cercano donde haya enemigos
     * @param {ScanData[]} scanData
     * @return {ScanData[]} Lista ordenada por prioridad
     */
    #closestEnemies(scanData) {
        return scanData.sort((a, b) => a.distance - b.distance);
    }

    /**
     * Priorizar el punto más lejano donde haya enemigos
     * @param {ScanData[]} scanData 
     * @return {ScanData[]} Lista ordenada por prioridad
     */
    #furthestEnemies(scanData) {

        return scanData.sort((a, b) => b.distance - a.distance);
    }

    /**
     * Prioriza los puntos donde haya algun aliado
     * @param {ScanData[]} scanData
     * @return {ScanData[]} Lista ordenada por prioridad
     */
    #assistAllies(scanData) {
        return scanData.sort((a, b) => {
            if (a.allies && !b.allies) return -1;

            if (b.allies && !a.allies) return 1;

            return 0;
        });
    }

    /**
     * Evita atacar puntos donde haya algun aliado
     * @param {ScanData[]} scanData
     * @return {ScanData[]} Lista filtrada
     */
    #avoidCrossfire(scanData) {
        return scanData.filter((data) => {
            return !data.allies;
        });
    }

    /**
     * Priorizar puntos donde el tipo de enemigo sea "mech"
     * @param {ScanData[]} scanData
     * @return {ScanData[]} Lista ordenada por prioridad
     */
    #prioritizeMech(scanData) {
        return scanData.sort((a, b) => {
            if (a.enemies.type === "mech" && b.enemies.type !== "mech") return -1;

            if (b.enemies.type === "mech" && a.enemies.type !== "mech") return 1;

            return 0;
        });
    }

    /**
     * No debe atacarse puntos donde el tipo de enemigo sea "mech"
     * @param {ScanData[]} scanData
     * @return {ScanData[]} Lista filtrada
     */
    #avoidMech(scanData) {
        return scanData.filter((data) => data.enemies.type !== "mech");
    }

    /**
     * Añade la distancia a cada punto y filtra los que estan demasiado lejos
     * @param {ScanData[]} scanData 
     */
    #addPointsDistance(scanData) {
        const result = [];

        for (let i = 0; i < scanData.length; i++) {
            const data = scanData[i];
            const distance = utils.coordsDistance(data.coordinates);
            if (distance <= 100) {
                data.distance = distance;
                result.push(data)
            }
        }

        return result;
    }


}

module.exports = {
    Droid
}