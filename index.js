import { createRequire } from "module";
const require = createRequire(import.meta.url);
var Parser = require('@postlight/parser');
var natural = require('natural');
var express = require('express');
var cors = require('cors');
const { CohereClient } = require("cohere-ai");
const cohere = new CohereClient({
    token: "ZtNvYYoLXeBcTdu88YDwLUR9oiY1nE8xmHQTbxIz",
});

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const app = express();
app.use(jsonParser)
app.use(cors())

var tokenizer = new natural.WordTokenizer();
var senTokenizer = new natural.SentenceTokenizer();
const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']
app.listen(4000, () => {
    console.log('listening on port 4000');
})

app.post('/getImg', async(req,res)=> {
    const url = req.body.url;
    Parser.parse(`${url}`).then(result=>{
        // console.log(result);
        let obj = {"imageUrl": result.lead_image_url}
        res.send(obj);
    });
})

app.post('/smartRead', async (req, res) => {
    const url = req.body.url;
    Parser.parse(url)
        .then(async (result) => {
            let summaryObj = await cohere.summarize({
                text: result.content,
                model:'command-light'
            });
            let sentences = senTokenizer.tokenize(summaryObj.summary);
            res.send(sentences);
        });
});

// app.post('/smartRead', async (req, res) => {
//     const url = req.body.url
//     Parser.parse(`${url}`)
//         .then(result => {
//             result.content = result.content.replace(/<[^>]*>?/gm, '');
//             result.content = result.content.replace(/&apos;/g, '\'')
//             result.content = result.content.replace(/&quot;/g, '"');
//             result.content = result.content.replace(/&#xA0;/g, ' ')
//             result.content = result.content.replace(/&amp;/g, '&')
//             result.content = result.content.replace(/&#x201C;/g, '"')
//             result.content = result.content.replace(/&#x201D;/g, '"')
//             result.content = result.content.replace(/&#x2019;/g, "'")
//             result.content = result.content.replace(/&#x2013;/g, "-")
//             result.content = result.content.replace(/&#x2026;/g, "...")
//             result.content = result.content.replace(/&#x2C6;/g, "^");
//             result.content = result.content.replace(/&#x2DC;/g, "~");
//             result.content = result.content.replace(/&#x2002;/g, " ");
//             result.content = result.content.replace(/&#x2003;/g, " ");
//             result.content = result.content.replace(/&#x2009;/g, " ");
//             result.content = result.content.replace(/&#x200C;/g, " ");
//             result.content = result.content.replace(/&#x200D;/g, " ");
//             result.content = result.content.replace(/&#x200E;/g, " ");
//             result.content = result.content.replace(/&#x200F;/g, " ");
//             result.content = result.content.replace(/&#x2014;/g, "--");
//             result.content = result.content.replace(/&#x2018;/g, "'");
//             result.content = result.content.replace(/&#x201A;/g, "‚");
//             result.content = result.content.replace(/&#x201E;/g, ",,");
//             result.content = result.content.replace(/&#x2039;/g, "<");
//             result.content = result.content.replace(/&#x203A;/g, ">");
//             result.content = result.content.replace(/&#x20B9;/g, "₹");
//             let list = tokenizer.tokenize(result.content);
//             let sentences = senTokenizer.tokenize(result.content);
//             let filteredList = list.filter(l => !stopWords.includes(l));
//             let score = {};
//             for (let l of filteredList) {
//                 if (score.hasOwnProperty(l)) {
//                     score[l] = score[l] + 1;
//                 }
//                 else {
//                     score[l] = 1;
//                 }
//             }
//             let topWords = Object.entries(score).sort((a, b) => b[1] - a[1]).map(el => el[0]).slice(0, 10);
//             let sentenceScore = {};
//             for (let s of sentences) {
//                 sentenceScore[s] = 0;
//                 for (let t of topWords) {
//                     if (s.includes(t)) {
//                         sentenceScore[s] += 1;
//                     }
//                 }
//             }
//             let topSentences = Object.entries(sentenceScore).sort((a, b) => b[1] - a[1]).map(el => el[0]).slice(0, 5);
//             res.send(topSentences);

//         });
// });
