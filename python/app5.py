import json

# Un string en formato JSON
#json_string = '{"nombre": "Carlos", "edad": 30, "ciudad": "Santiago"}'

# Convertir a diccionario de Python
data = json.loads(json_string)

print(data)
print(data["nombre"])