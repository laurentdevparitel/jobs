/* 
 * author : lelion21@gmail.com
 */

/**
 * Rental Obj
 * @param {int} id
 * @param {int} car_id
 * @param {string} start_date
 * @param {string} end_date
 * @param {float} distance
 * @returns {void}
 */
function Rental(id, car_id, start_date, end_date, distance) {
    this.id = id;
    this.car_id = car_id;
    this.start_date = start_date;
    this.end_date = end_date;
    this.distance = distance;
    this.deductible_reduction = false;

    this.Car = null;
    this.rentalDay = 0;
    this.price = 0;

}
Rental.prototype.getId = function () {
    return this.id;
};
Rental.prototype.setRentalDay = function () {
    //console.log("### setRentalDay");
    var tmps;
    tmps = this.start_date.split("-");
    var start_date = new Date(tmps[0], (tmps[1] === 0 ? tmps[1] : tmps[1] - 1), tmps[2]);

    tmps = this.end_date.split("-");
    var end_date = new Date(tmps[0], (tmps[1] === 0 ? tmps[1] : tmps[1] - 1), tmps[2]);

    this.rentalDay = (end_date.getTime() - start_date.getTime()) / (3600 * 24 * 1000);
    this.rentalDay++;   // on inclut le dernier jour !    
};
Rental.prototype.getRentalDay = function () {
    return this.rentalDay;
};

Rental.prototype.getDiscountedPricePerDay = function () {
    //console.log("### getDiscountedPricePerDay", this.getRentalDay());
    var discountedPricePerDay;

    if (this.getRentalDay() > 10) {
        discountedPricePerDay = this.Car.price_per_day - (0.5 * this.Car.price_per_day);
    }
    else if (this.getRentalDay() > 4) {
        discountedPricePerDay = this.Car.price_per_day - (0.3 * this.Car.price_per_day);
    }
    else if (this.getRentalDay() > 1) {
        discountedPricePerDay = this.Car.price_per_day - (0.1 * this.Car.price_per_day);
    }
    else {
        discountedPricePerDay = this.Car.price_per_day;
    }
    //console.log("### getDiscountedPricePerDay", this.getRentalDay(), discountedPricePerDay);
    return discountedPricePerDay;
};

Rental.prototype.setPrice = function (addDiscount) {
    var addDiscount = typeof (addDiscount) !== "undefined" ? addDiscount : false;
    //console.log("### setPrice", addDiscount);
    var pricePerDay = addDiscount ? this.getDiscountedPricePerDay() : this.Car.price_per_day;

    this.price = (this.getRentalDay() * pricePerDay) + (this.distance * this.Car.price_per_km);
};
Rental.prototype.getPrice = function () {
    return this.price;
};

Rental.prototype.getCarId = function () {
    return this.car_id;
};
Rental.prototype.setCar = function (Car) {
    this.Car = Car;
};
Rental.prototype.getCar = function (Car) {
    return this.Car;
};

Rental.prototype.startDate = function (start_date) {
    this.start_date = start_date;
};
Rental.prototype.endDate = function (end_date) {
    this.end_date = end_date;
};
Rental.prototype.distance = function (distance) {
    this.distance = distance;
};

Rental.prototype.setDeductibleReduction = function (deductible_reduction) {
    this.deductible_reduction = deductible_reduction;
};

Rental.prototype.getDeductibleReduction = function () {
    return this.deductible_reduction;
};