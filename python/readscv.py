import csv
from decimal import Decimal

# Archivo CSV de entrada
input_file = "statushistory.csv"

# Lista para guardar los penúltimos campos
penultimos_campos = []

# Abrir CSV
with open(input_file, newline='', encoding='utf-8') as csvfile:
    # Separador ;
    lector = csv.reader(csvfile, delimiter=';')
    
    # Leer encabezado
    encabezado = next(lector, None)
    
    # Procesar cada fila
    x=0

    for fila in lector:
        x+=1
        y=0

        if len(fila) >= 2:
            penultimos_campos.append(" 1)"+fila[0]+" 2)"+fila[1]+" 3)"+fila[2]+" 4)"+fila[3]+" 5)"+fila[4]+" 6)"+fila[5]+" 7)"+fila[7]+" 8)"+fila[-2]+" 9)"+fila[-1])  # penúltimo campo
# Mostrar resultados
print("✅*** Penúltimos campos (Duración Hr.):")
valor2 = float(0)
for valor in penultimos_campos:
    x+=1
    print(valor)
    print(valor2)
    #valor2= valor2+fila[-1]