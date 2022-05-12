import json
import pandas as pd

f = open("intersections.json")
data = json.load(f)
f.close()

#Prints list of coordinates on a feature

df = pd.DataFrame(columns=['id', 'lat', 'lon', 'connected_to'])
# print(df)
for feature in data["features"]:
    # add all types to set
    connection = feature["geometry"]["coordinates"]
    if feature["geometry"]["type"] == "Polygon":
        connection = connection[0]
    length = len(connection)
    ctr = 1
    while ctr < length:
        coord0 = connection[ctr - 1]
        coord1 = connection[ctr]
        id = f"{coord0[1]}{coord0[0]}"
        connected_to = f"{coord1[1]}{coord1[0]}"
        lat = coord0[1]
        lon = coord0[0]
        row = pd.DataFrame.from_dict({'id': [id], 'lat': [lat], 'lon': [lon], 'connected_to': [connected_to]})
        df = pd.concat([df, row], ignore_index=True)
        ctr += 1
    break
df.to_csv('intersections.csv', index=False)
print(df)
# print(types)
#print(data["features"][0]["geometry"]["coordinates"][0])