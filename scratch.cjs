const https = require('https');
const fs = require('fs');

const queries = {
    "lobby_evacuation_base": "hotel lobby",
    "lobby_yell_panic": "panic crowd",
    "lobby_doors_locked": "closed glass doors",
    "lobby_calm_exit": "emergency exit sign"
};

for (const [name, query] of Object.entries(queries)) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap%20${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&format=json`;
    
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json.query && json.query.pages) {
                    const pages = json.query.pages;
                    const pageId = Object.keys(pages)[0];
                    const imageUrl = pages[pageId].imageinfo[0].url;
                    console.log(`Downloading ${imageUrl} for ${name}`);
                    
                    const file = fs.createWriteStream(`c:/Users/DELL/Desktop/rest/public/${name}.png`);
                    https.get(imageUrl, (imgRes) => {
                        imgRes.pipe(file);
                        file.on('finish', () => {
                            file.close();
                            console.log(`Finished downloading ${name}`);
                        });
                    });
                } else {
                    console.log(`No results for ${name}`);
                }
            } catch (e) {
                console.log(`Failed for ${name}: ${e}`);
            }
        });
    }).on('error', (e) => {
        console.error(e);
    });
}
