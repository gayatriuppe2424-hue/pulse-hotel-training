import urllib.request
import json
import os
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

queries = {
    "lobby_evacuation_base": "hotel lobby",
    "lobby_yell_panic": "panic crowd",
    "lobby_doors_locked": "closed glass doors",
    "lobby_calm_exit": "emergency exit sign"
}

for name, query in queries.items():
    url = f"https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap%20{urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if 'query' in data and 'pages' in data['query']:
                pages = data['query']['pages']
                for page_id in pages:
                    image_url = pages[page_id]['imageinfo'][0]['url']
                    print(f"Downloading {image_url} for {name}")
                    urllib.request.urlretrieve(image_url, f"c:/Users/DELL/Desktop/rest/public/{name}.png")
            else:
                print(f"No results for {name}")
    except Exception as e:
        print(f"Failed for {name}: {e}")
