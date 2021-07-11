const { default: axios } = require('axios');
const fs = require('fs');
const { exit } = require('process');
const qs = require('querystring');
const jishoFactory = require('unofficial-jisho-api');
const jisho = new jishoFactory();

async function main() {
    if (process.argv.length < 3) {
        console.log('main.js <path>')
        exit(1)
    }

    const strings = [];
    const terms = fs.readFileSync(process.argv[2]).toString().split("\n");
    console.log(`populating ${terms.length} flash cards...`)
    for(let term of terms) {
        let isRedWord = false;
        if (term.startsWith("*")) {
            term = term.slice(1);
            isRedWord = true;
        }
        const renderedTerm = isRedWord ? `<span style="color:red;font-weight:bold">${term}</span>` : term;

        try {
            console.log('searching for', term);
            const rsp = await axios.get(`https://jisho.org/api/v1/search/words?keyword=${qs.escape(term)}`);
            if (rsp.data?.data) {
                const def = rsp.data.data[0];
                const reading = def.japanese.find(d => d.word === term)?.reading || term;
                const [mainDef, ...otherDefs] = def.senses;
                const eigoDef = mainDef.english_definitions.join(", ");
                const usageCategory = mainDef.parts_of_speech.join(", ");
                
                let examples = []
                try {
                    const exampleRsp = await jisho.searchForExamples(term);
                    examples = exampleRsp.results.slice(0, 3).map((result, idx) => `${idx + 1}. ${result.kanji}<br/>${result.kana}<br/>${result.english}`);
                } catch (error) {
                    console.error('failed searching for examples');
                }

                strings.push(`${renderedTerm}\t${eigoDef}<br/>(${usageCategory})\t${reading}\t${examples.join("<br/><br/>")}`);
            } 
        } catch(error) {
            strings.push(`${renderedTerm}\tError\tError\tError`);
            console.error('Caught error, skipping', error);
        }
    }
    fs.writeFileSync(`${__dirname}/${process.argv[2]}.definitions.tsv`, strings.join("\n"));
}

main();