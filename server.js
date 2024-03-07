const https = require('https');
const http = require('http')
const storiesData =require('./storiesdata')
function dataFromLink(links) {
    let Array = [];
    links.forEach(e => {
        let l = e.replace('href="', "");
        let m = l.replace('">', "");
        m = 'https://time.com' + m;
        Array.push(m);
    });
    return Array;

}


function extractData(data) {

    let processData = data.replace(/\n/g, "");
    processData = processData.replace(/[t ]+\</g, "<")
    processData = processData.replace(/\>[\t ]+\</g, "><")
    processData = processData.replace(/\>[\t ]+$/g, ">")

    let processDataobj = processData.match(/Latest Stories(.*?)<\/ul>/)

    processData = processDataobj[0]
    let links = processData.match(/href="(.*?)>/g);
    let stories = processData.match(/line">(.*?)h3>/g)

    const processedLink = dataFromLink(links);
    const processTitle = storiesData(stories);

    let finalStoriesArray = [];

    for (i = 0; i < 6; i++) {
        let storyObject = {};
        storyObject['title'] = processTitle[i];
        storyObject['link'] = processedLink[i];

        finalStoriesArray.push(storyObject)
    }
    return finalStoriesArray;
}




var options = {
    host: 'time.com',
    path: '/',
    method: 'GET'
};

const getData = () => {
    return new Promise((resolve, reject) => {
        https.request(options, (res) => {
            let str = '';
            res.on('data', (d) => {
                let data = d.toString();
                str += data;

            });
            res.on('end', () => {
                resolve(str);
            })
            res.on('error', (error) => {
                reject(error);
            })
        }).end();
    })
}
async function getTopSixLatestNews() {
    let data;
    await getData().then((d) => {
        data = d
    }).catch((err) => {
        throw err;
    });

    let finalData = extractData(data)
    const host = 'localhost';
    const port = 3000;

    const requestListener = function (req, res) {
        res.writeHead(200, { 'Content-Type': 'text/json' });
        if (req.url === '/getTimeStories') {
            res.end(JSON.stringify(finalData));
        }
    };
    const server = http.createServer(requestListener);
    server.listen(port, host, () => {
        console.log(`Click on the above link http://${host}:${port}/getTimeStories`);
    });


}

getTopSixLatestNews();