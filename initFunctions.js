var findCountyForVacCenter = function(){

    var countiesArray = db.counties.find().toArray();

    for(var i = 0; i < countiesArray.length; i++){
        db.vacCenter.updateMany({"coords" : {"$within" : {"$polygon" : countiesArray[i]["coords"]}}}, {"$set" : {"county" :countiesArray[i]["name"]}});
    }

    
}

db.system.js.save({_id : "findCountyForVacCenterSV", value : findCountyForVacCenter})





var getRisks = function(){

    var patientsArray = db.patients.find().toArray();

    for(var i = 0; i < patientsArray.length; i++)
    {
        var currentPatient = patientsArray[i];

        var totalRiskReduction = 0;
        for(var j = 0; j < currentPatient["medicalHistory"].length; j++)
        {
            risk = db.medicalRisks.find({"condition" : currentPatient["medicalHistory"][j]}).toArray();
            totalRiskReduction = totalRiskReduction + risk[0]["riskReduction"];
        }

        db.patients.updateMany({"_id" : currentPatient["_id"]},{"$set" : {"riskReduction" : totalRiskReduction}});
    }
    
    

}



db.system.js.save({_id: "getRisksSV", value: getRisks})

getRisks()

var addPersonnel = function(){

    var personnelArray = db.personnel.find().toArray();

    for(var i = 0; i < personnelArray.length; i++)
    {
        currentShifts = personnelArray[i]["shifts"];

        for(var j = 0; j < currentShifts.length; j++)
        {
            var organigram = db.vacCenter.findOne({"_id" : currentShifts[j]["vacCenter"]},{"org" : 1})["org"];

            if(personnelArray[i]["position"] == "medic" && organigram["medics"].includes(personnelArray[i]["_id"]) == false)
                db.vacCenter.findOneAndUpdate({"_id" : currentShifts[j]["vacCenter"]}, {"$push" : {"org.medics" : personnelArray[i]["_id"]}});
            else if(personnelArray[i]["position"] == "nurse" && organigram["nurses"].includes(personnelArray[i]["_id"]) == false)
                db.vacCenter.findOneAndUpdate({"_id" : currentShifts[j]["vacCenter"]}, {"$push" : {"org.nurses" : personnelArray[i]["_id"]}});
            else if(personnelArray[i]["position"] == "clerk" && organigram["clerks"].includes(personnelArray[i]["_id"]) == false)
                db.vacCenter.findOneAndUpdate({"_id" : currentShifts[j]["vacCenter"]}, {"$push" : {"org.clerks" : personnelArray[i]["_id"]}});

        }
    }
}

db.system.js.save({_id: "addPersonnelSV", value: addPersonnel})



var mapCondition = function(){

    for(var i = 0; i < this.medicalHistory.length; i++)
    {   
        emit(this.medicalHistory[i], this.age);
    }

}

var reduceCondition = function(condition, ages)
{
    reducedVal = {count: 0, sum: 0}

    for(var i=0; i < ages.length;i++)
    {
        reducedVal.count += 1;

        reducedVal.sum += ages[i];
    }

    return reducedVal.sum / reducedVal.count;
}


var getConditionAgeAvg = function(){

    db.patients.mapReduce(mapCondition,reduceCondition,{"out" : "ageCondAvg"});

    return db.ageCondAvg.find();
}

db.system.js.save({_id: "mapConditionSVMR", value: mapCondition})

db.system.js.save({_id: "reduceConditionSVMR", value: reduceCondition})

db.system.js.save({_id: "getConditionAgeAvgSV", value: getConditionAgeAvg})



var mapHours = function(){

    for(var i = 0; i< this.shifts.length; i++)
        emit(this.name, this.shifts[i].stopHour - this.shifts[i].startHour);
}

var reduceHours = function(name, deltas){

    count = 0

    for(var i=0 ; i < deltas.length; i++)
        count += deltas[i];

    return count;
}

var getWorkingHours = function(){

    db.personnel.mapReduce(mapHours, reduceHours, {"out" : "workingLeaderboard"});

    return db.workingLeaderboard.find().sort({"value" : -1});
}

db.system.js.save({_id: "mapHoursSVMR", value: mapHours})

db.system.js.save({_id: "reduceHoursSVMR", value: reduceHours})

db.system.js.save({_id: "getWorkingHoursSV", value: getWorkingHours})



var mapNrVaccines = function(){

    for(var i = 0; i < this.vaccines.length ; i++)
        emit(this.vaccines[i].type, 1)

}

var reduceNrVaccines = function(key,values){

    count = 0;

    for(var i = 0; i < values.length; i++)
        count += values[i];

    return count
    
}

var getVaccinesPerCounty = function(){

    db.patients.mapReduce(mapNrVaccines, reduceNrVaccines, {"out" : "nrVaccinesCounty"});

    return db.nrVaccinesCounty.find().sort({"value" : -1});

}

db.system.js.save({_id: "mapNrVaccinesSVMR", value: mapNrVaccines})

db.system.js.save({_id: "reduceNrVaccinesSVMR", value: reduceNrVaccines})

db.system.js.save({_id: "getVaccinesPerCountySV", value: getVaccinesPerCounty})



db.loadServerScripts()

getVaccinesPerCounty()

getWorkingHours()

getConditionAgeAvg()

addPersonnel()

findCountyForVacCenter()


