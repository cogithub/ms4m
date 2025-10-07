import pandas as pd

df = pd.read_csv("statushistory.csv", delimiter=";")
print(df)           # muestra todo el DataFrame
print(df.columns)   # muestra los nombres de las columnas