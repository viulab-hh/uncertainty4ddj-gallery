import json

with open('data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Sample dates converted to German format:\n")
for i, record in enumerate(data[:5], 1):
    print(f"{i}. {record['Datum']}")
