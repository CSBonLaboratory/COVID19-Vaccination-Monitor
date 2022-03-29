FROM mongo:latest
COPY personnel.txt /personnel.json
COPY vacCenter.txt /vacCenter.json
COPY patients.txt /patients.json
COPY counties.txt /counties.json
COPY initFunctions.js /initFunctions.js
COPY medicalRisks.txt /medicalRisks.json
COPY setup.sh /setup.sh
ENV DB_NAME="projectDB"
ENV PATIENT_COL="patients"
ENV PERSONNEL_COL="personnel"
ENV VACCENTER_COL="vacCenter"
ENV COUNTIES_COL="counties"
ENV MEDICAL_RISK_COL="medicalRisks"
ENV HOST_IMPORT="127.0.0.1"
ENV PORT=27017
EXPOSE ${PORT}
WORKDIR /
