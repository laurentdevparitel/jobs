/* 
 * author : lelion21@gmail.com
 */

//function Owner(id) {
//    this.id = id;
//}
//function Driver(id) {
//    this.id = id;
//}


/**
 * Drivy Obj
 * @param {obj} data
 * @returns {Drivy}
 */
function Drivy(data) {
    this.data = data;
    this.rentals = [];
    this.rentals_updated = [];
    this.output = {
        rentals: []
    };
    this.addDiscount = false;
    this.addCommission = false;
    //this.addDeductibleReduction = false;
    this.showActions = false;   // show debited/credited for each actor

    this.Rental = null;
    this.Commission = null;
    this.Options = null;
}

Drivy.prototype.setRental = function (Rental) {
    this.Rental = Rental;
};
Drivy.prototype.getRental = function () {
    return this.Rental;
};
Drivy.prototype.setCommission = function (Commission) {
    this.Commission = Commission;
};
Drivy.prototype.getCommission = function () {
    return this.Commission;
};
Drivy.prototype.setOptions = function (Options) {
    this.Options = Options;
};
Drivy.prototype.getOptions = function () {
    return this.Options;
};
Drivy.prototype.getRentals = function () {
    return this.rentals;
};

/**
 * get Actions by user
 * @returns {Array}
 */
Drivy.prototype.getActions = function () {

    var me = this;
    var actions = [];
    var myAction;
    var amount = 0;

    if (!me.getRental()) {
        throw new Error("no recorded Rental ...");
        return actions;
    }
    //console.log('### getActions °°° rental: ', me.getRental());

    ["driver", "owner", "insurance", "assistance", "drivy"].forEach(function (who) {

        switch (who) {
            case "driver":
                amount = me.getRental().getPrice();
                if (!me.getOptions()) {
                    console.warn("no recorded Options for Rental #" + me.getRental().id);
                    //throw new Error("no recorded Options ...");
                }
                else {
                    amount += me.getOptions().getDeductibleReduction();
                }
                myAction = new Action(who, "debit", amount);
                break;

            case "owner":
                amount = me.getRental().getPrice();
                if (!me.getCommission()) {
                    throw new Error("no recorded Commission for Rental #" + me.getRental().id);
                }
                else {
                    amount -= me.getCommission().getCommissionTotal();
                }
                myAction = new Action(who, "credit", amount);
                break;

            case "insurance":
                if (!me.getCommission()) {
                    throw new Error("no recorded Commission for Rental #" + me.getRental().id);
                }
                else {
                    amount = me.getCommission().commission.insurance_fee;
                }
                myAction = new Action(who, "credit", amount);
                break;

            case "assistance":
                if (!me.getCommission()) {
                    throw new Error("no recorded Commission for Rental #" + me.getRental().id);
                }
                else {
                    amount = me.getCommission().commission.assistance_fee;
                }
                myAction = new Action(who, "credit", amount);
                break;

            case "drivy":
                if (!me.getCommission()) {
                    throw new Error("no recorded Commission for Rental #" + me.getRental().id);
                }
                else {
                    amount = me.getCommission().commission.drivy_fee;
                }
                if (!me.getOptions()) {
                    console.warn("no recorded Options for Rental #" + me.getRental().id);
                    //throw new Error("no recorded Options ...");
                }
                else {
                    amount += me.getOptions().getDeductibleReduction();
                }
                myAction = new Action(who, "credit", amount);
                break;

            default:
                myAction = null;
        }

        if (myAction) {
            //console.log("### getActions", myAction);
            actions.push(myAction.get());
        }
    });

    return actions;
};

/**
 * Update rentals with new incoming data
 * TODO : refactoring with compute method
 * @param {obj} data
 * @returns {void}
 */
Drivy.prototype.updateRentals = function (data) {
    var me = this;

    me.rentals_updated = [];    // init
    me.output.rental_modifications = [];    // init

    var myRental, myCar, myCommission, myOptions, o;
    data.forEach(function (d) {
        me.rentals.forEach(function (obj) {
            if (obj.rental && obj.rental.id === d.rental_id) {
                //console.log('### updateRentals °°° updating rental #' + d.rental_id, obj);

                myRental = new Rental(// create new Rental obj (clone obj ?)
                        obj.rental.id,
                        obj.rental.car_id,
                        typeof (d.start_date) !== "undefined" ? d.start_date : obj.rental.start_date,
                        typeof (d.end_date) !== "undefined" ? d.end_date : obj.rental.end_date,
                        typeof (d.distance) !== "undefined" ? d.distance : obj.rental.distance);

                // TODO : refactor ....
                myRental.setDeductibleReduction(obj.rental.deductible_reduction);

                myCar = obj.rental.Car;
                myRental.setCar(myCar);

                myRental.setRentalDay();
                myRental.setPrice(me.addDiscount);

                me.setRental(myRental);

                if (me.addCommission) {
                    myCommission = new Commission(myRental.getPrice(), myRental.getRentalDay());
                    myCommission.setCommission();

                    me.setCommission(myCommission);
                }
                if (myRental.getDeductibleReduction()) {
                    myOptions = new Options();
                    myOptions.setDeductibleReduction(myCar.price_per_day, myRental.getRentalDay());

                    me.setOptions(myOptions);
                }

//                console.log('### updateRentals °°° updated rental #' + d.rental_id, myRental, obj.rental);
//                console.log('### updateRentals °°° updated Commission #' + d.rental_id, myCommission.getCommission(), obj.commission.getCommission());
//                console.log('### updateRentals °°° updated Options #' + d.rental_id, myOptions.getOptions(), obj.options.getOptions());
//                console.log('### updateRentals °°° updated Actions #' + d.rental_id, me.getActions());

//                me.rentals_updated.push({
//                    rental: myRental,
//                    commission: myCommission,
//                    options: myOptions
//                    //output:o
//                });

                me.output.rental_modifications.push({
                    id: d.id,
                    rental_id: obj.rental.id,
                    actions: me.getActions()
                });

            }
        });
    });

};

/**
 * Compute
 * @returns {void}
 */
Drivy.prototype.compute = function () {
    var me = this;
    var data = this.data;
    var o, myCar, myRental, myCommission, myOptions;
    var found = false;
    
    data.rentals.forEach(function (rental) {
        myRental = new Rental(rental.id, rental.car_id, rental.start_date, rental.end_date, rental.distance);
        me.setRental(myRental);
        me.setCommission(null); // init
        me.setOptions(null);    // init
        //console.log('°°° compute', myRental);
        
        found = false;  // init;
        
        data.cars.forEach(function (car) {
            //console.log('°°° compute, searching car #'+myRental.getCarId());
            if (myRental.getCarId() === car.id) {
                found = true; 
                myCar = new Car(car.id, car.price_per_day, car.price_per_km);
                myRental.setCar(myCar);
                //console.log('°°° compute', myRental.getCar());

                myRental.setRentalDay();
                myRental.setPrice(me.addDiscount);

                me.setRental(myRental);

                // output
                o = {
                    id: myRental.getId(),
                    price: myRental.getPrice()
                };

                if (me.addCommission) {
                    myCommission = new Commission(myRental.getPrice(), myRental.getRentalDay());
                    myCommission.setCommission();

                    me.setCommission(myCommission);

                    o.commission = myCommission.getCommission();
                }
                if (typeof (rental.deductible_reduction) !== "undefined" && rental.deductible_reduction) {
                    myRental.setDeductibleReduction(rental.deductible_reduction);

                    myOptions = new Options();
                    myOptions.setDeductibleReduction(car.price_per_day, myRental.getRentalDay());

                    me.setOptions(myOptions);

                    o.options = myOptions.getOptions();
                }

                if (me.showActions) {
                    //console.log(me);
                    o.actions = me.getActions();
                }

                me.rentals.push({
                    rental: myRental,
                    commission: myCommission,
                    options: myOptions,
                    output: o
                });
                me.output.rentals.push(o);
            }
        });
        if (!found){
            throw new Error("No rental car found with id:#" + myRental.getCarId());
        }
    });

    if (typeof (data.rental_modifications) !== "undefined") {   // update rentals
        console.log('°°° updating rentals ...');
        me.updateRentals(data.rental_modifications);
    }
};

/**
 * Output (JSON)
 * @param {array} filters
 * @returns {Obj|JSON}
 */
Drivy.prototype.getOutput = function (filters, json) {
    var filters = typeof (filters) !== "undefined" ? filters : [];
    var json = typeof (json) !== "undefined" ? json : false;
    var me = this;
    if (filters.length) {
        var tmps = {};
        filters.forEach(function (filter) {
            if (typeof (me.output[filter]) !== "undefined") {
                tmps[filter] = me.output[filter];
            }
        });
        return json ? JSON.stringify(tmps) : tmps;
    }
    else {
        return json ? JSON.stringify(this.output) : this.output;
    }
};
Drivy.prototype.setOutput = function (o) {
    this.output = o;
};


