#!/bin/bash
mongoimport --host=$HOST_IMPORT --port=27017 --db=$DB_NAME --collection=$PATIENT_COL --type=json --file=/patients.json
mongoimport --host=$HOST_IMPORT --port=27017 --db=$DB_NAME --collection=$PERSONNEL_COL --type=json --file=/personnel.json
mongoimport --host=$HOST_IMPORT --port=27017 --db=$DB_NAME --collection=$COUNTIES_COL --type=json --file=/counties.json
mongoimport --host=$HOST_IMPORT --port=27017 --db=$DB_NAME --collection=$VACCENTER_COL --type=json --file=/vacCenter.json
mongoimport --host=$HOST_IMPORT --port=27017 --db=$DB_NAME --collection=$MEDICAL_RISK_COL --type=json --file=/medicalRisks.json
#mongo $HOST_IMPORT:27017/$DB_NAME initFunctions.js 
