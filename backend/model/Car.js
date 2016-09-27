/* 
 * author : lelion21@gmail.com
 */

/**
 * Car Obj
 * @param {int} id
 * @param {float} price_per_day
 * @param {float} price_per_km
 * @returns {void}
 */
function Car(id, price_per_day, price_per_km) {
    this.id = id;
    this.price_per_day = price_per_day;
    this.price_per_km = price_per_km;
}
Car.prototype.getId = function () {
    return this.id;
};
Car.prototype.setPricePerDay = function (price_per_day) {
    this.price_per_day = price_per_day;
};
Car.prototype.setPricePerKm = function (price_per_km) {
    this.price_per_km = price_per_km;
};
