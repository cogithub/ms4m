import csv

with open("statushistory.csv", newline='', encoding="utf-8") as csvfile:
    lector = csv.DictReader(csvfile, delimiter=";")
    for fila in lector:
        print(((fila["Duración Hr."])), fila["Hour"])  # ejemplo accediendo a columnas
