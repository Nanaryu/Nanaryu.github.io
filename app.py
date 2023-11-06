import requests

def get_server_data():
    url = "http://www.rucoyonline.com/server_list.json"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        servers = data.get("servers", [])
        total_characters = 0
        servers_dict = {}
        for server in servers:
            name = server.get("name", "")
            characters_online = server.get("characters_online", 0)
            visible = server.get("visible", "")
            if visible is True:
                server["visible"] = "true"
            servers_dict[name] = characters_online
            total_characters += characters_online
        servers = sorted(servers, key=lambda x: (x['region'], x['name']))
        return str(servers)
    else:
        return ["Failed to retrieve data from the JSON file."]

servers_string = get_server_data()
servers_string = servers_string.replace("'", "\"")

with open("data.json", 'w') as file:
    file.write(servers_string)

