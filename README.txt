Proiect Baze de Date 2
Bontas Carol Sebastian 341C3

Structura arhiva:

- client.py : clientul ce va interactiona cu baza de date 
- vacCenter.txt : fisier ce contine centrele de vaccinare
- patients.txt : fisier ce contine pacientii
- counties.txt : fisier ce contine judetele
- personnel.txt : fisier ce contine angajatii din centre
- medicalRisks.txt : fisier ce contine bolile si riscurile asociate
- Dockerfile : pregateste imaginea de MongoDB
- docker-compose.yml : face deploy la toata infrastructura folosind Dockerfile
- setup.sh : script pentru importul fisierelor .txt in baza de date
- initFunctions.js : fisier ce contine toate functile stocate folosite de MongoDB


Procedura initializare:

1. docker-compose up -d --build
2. docker exec -it <id container mongo> bash
3. ./setup.sh
4. mongo
5. use projectDB
6. load("initFunctions.js")
7. iesire din container
8. python3 client.py

