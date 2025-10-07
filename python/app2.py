import csv
import json

with open("statushistory.csv", newline='', encoding="utf-8") as csvfile:
    lector = csv.DictReader(csvfile, delimiter=";")  # usa "," si el archivo tiene comas
    for fila in lector:
        print(json.loads(fila))   # cada fila es un diccionario con clave = nombre de columna
