from pymongo import MongoClient
import matplotlib.pyplot as plt
import sys
mongo_client = None
patients = None
db = None
vacCenters = None
counties = None
personnel = None
conditions = None



def main():
    global mongo_client
    global db
    global patients
    global vacCenters
    global counties
    global personnel
    global conditions

    mongo_client = MongoClient(host="localhost", port = 27017)

    print(mongo_client)

    db = mongo_client["projectDB"]

    print('Database init ' + str(db))

    patients = db["patients"]

    print("Patients collection started " + str(patients))

    personnel = db["personnel"]

    print("Personnel collection started " + str(personnel))

    vacCenters = db["vacCenter"]

    print("VaccCenters collection started " + str(vacCenters))

    counties = db["counties"]

    print("Counties collection started" + str(counties))

    conditions = db["medicalRisks"]

    print("Condition collection started " + str(conditions))

    mongoConsole()

def mongoConsole():
    print("Available commands:")
    print("distrib  ---> get distribution of vaccination centers across counties")
    print("workers  ---> get leaderboard of workers with the most hours per day")
    print("vaccines ---> get number of vaccines per county")
    print("personnel <id : int of vaccCenter> ---> get distribution of personnel of the chosen vacCenter based on their position")

    while 1:
        for line in sys.stdin:
            command = line.rstrip()
            tokens = command.split()
            print(tokens)
            if 'distrib' == tokens[0]:
                vacCenterDistribution()
            if 'workers' == tokens[0]:
                getWorkers()
            if 'vaccines' == tokens[0]:
                getVaccinesPerCounty()
            if 'personnel' == tokens[0]:
                getPersonnelDistribution(int(tokens[1]))

            

def vacCenterDistribution():

    res = db.vacCenter.aggregate(
        [
            {"$group" : {"_id" : "$county","frequency" : {"$sum" : 1}}},
        ]
    )

    freq_dict = {}
    for e in res:
        if e["_id"] not in freq_dict:
            freq_dict[e["_id"]] = 1
        else:
            freq_dict[e["_id"]] += 1

    county_list = freq_dict.keys()

    freq_list = []

    for k in county_list:
        freq_list.append(freq_dict[k])

    
    
    fig, ax = plt.subplots()
    ax.pie(freq_list, labels=county_list, autopct='%.1f%%')
    ax.set_title('Distribution of vaccination centers across counties')

    plt.show()

def getWorkers():

    workers = db["workingLeaderboard"]

    res = workers.find().sort("value", -1)

    work_names_list = []
    work_hours_list = []
    for e in res:
        work_names_list.append(e["_id"])
        work_hours_list.append(e["value"])
    
    fig = plt.figure(figsize = (24, 10))

    plt.bar(work_names_list, work_hours_list, color ='green',width = 0.5)

    plt.xlabel("Name of workers")

    plt.ylabel("Number of hours")

    plt.title("Total number of working hours per day")

    plt.show()
    
    return None


def getVaccinesPerCounty():

    no_vaccines = db["nrVaccinesCounty"]

    res = no_vaccines.find()

    vaccine_name_list = []

    vaccine_freq_list = []

    for e in res:
        print(e)
        vaccine_name_list.append(e["_id"])
        vaccine_freq_list.append(e["value"])

    fig, ax = plt.subplots()
    ax.pie(vaccine_freq_list, labels=vaccine_name_list, autopct='%.1f%%')
    ax.set_title('Vaccine types')

    plt.show()

def getPersonnelDistribution(vacCenter_id):

    print(vacCenter_id)
    center = vacCenters.find_one({"_id" : vacCenter_id})
    if center == None:
        print("No vaccination center with this id")
        return None

    medics_no = len(center["org"]["medics"])
    nurser_no = len(center["org"]["nurses"])
    clerks_no = len(center["org"]["clerks"])

    values = [medics_no,nurser_no,clerks_no]
    tags = ["Medics", "Nurses", "Clerks"]

    fig, ax = plt.subplots()
    ax.pie(values, labels=tags, autopct='%.1f%%')
    ax.set_title('Distribution of personnel in vaccination center ' + str(vacCenter_id))

    plt.show()
        


if __name__ == '__main__':
    main()
