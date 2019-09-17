import csv
import requests
import sys

if len(sys.argv) != 3:
    print('Invalid arguments')
    exit()

URL = 'https://arcane-taiga-41727.herokuapp.com/api/contacts'
FILENAME = sys.argv[1]
TOKEN = sys.argv[2]

with open(FILENAME) as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        name = row[0].strip() + ' ' + row[1].strip()
        number = row[2].strip()

        JSON = {
            'name': name,
            'phone_number': number,
        }

        r = requests.post(url=URL, json=JSON, headers={'x-access-token': TOKEN})

        data = r.json()

        print(data)

print('Done!')

