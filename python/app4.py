import csv
import json


with open("statushistory.csv", newline='', encoding="utf-8") as csvfile:
    lector = csv.DictReader(csvfile, delimiter=";")  # usa "," si el archivo tiene comas
    for fila in lector:
        json.loads(fila)
        print(fila)   # cada fila es un diccionario con clave = nombre de columna
