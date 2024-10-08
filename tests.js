const fs = require('node:fs');
const OpenAI = require('openai');
const markdown = require('markdown');
const {NodeHtmlMarkdown} = require("node-html-markdown");
// let node_html_md = require('node-html-markdown').NodeHtmlMarkdown;
let chatgpt, node_html_md;

let config = null;

/**
 *
 * main process
 *
 */
// _initialize_config();

// const original_content = fs.readFileSync(__dirname + '/bloom-inference-optimization.md', 'utf8');
// let raw = original_content.split('\n');
// let blocks = [];
// let block = {
//     text : '',
//     need_translate : true
// };
// for (let i = 0; i < raw.length; i++) {
//     // console.log( i + '  :  ' + raw[i]);
//     // if(raw[i].includes('```')){
//     //     block.need_translate = false;
//     // }
//     block.text += (raw[i] + '\n');
//     if(raw[i] === '') {
//         block.text = markdown.parse(block.text);
//         blocks.push(block);
//         block = {
//             text : '',
//             need_translate : true
//         };
//     }
// }

// let file_content = fs.readFileSync(__dirname + '/output_initial.md', 'utf8');
// let res = node_html_md.translate(file_content);
// fs.writeFileSync(__dirname + '/output_converted.md', res);

// for(let i = 0; i < blocks.length; i++) {
//     let block = blocks[i];
//     let md = markdown.parse(block.text);
//     console.log( 'Block No.' + i + '\n' + JSON.stringify(md));
// }
// _test_openai(blocks);
// _test_openai();


/**
 *
 *
 * local functions
 *
 *
 */


function initialize_config(){
    try {
        //load api key from local config file
        const data = fs.readFileSync(__dirname + '/config.json', 'utf8');
        config = JSON.parse(data.toString());
        chatgpt = new OpenAI({apiKey: config.openai_key});
        node_html_md = new NodeHtmlMarkdown({}, undefined, undefined);
    } catch (err) {
        console.error(err);
    }
}

async function _test_openai(raw){

    let progressbar = '';
    // const original_content = fs.readFileSync(__dirname + '/bloom-inference-optimization.md', 'utf8');
    for(let i=0; i<raw.length; i++){
        let block = raw[i];
        if(block.need_translate && block.text !== ''){
            let content = block.text;
            console.log( 'Block No.' + i + '\n' + content);
            // console.log('input:' + content)
            let completion = await chatgpt.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a highly skilled translator tasked with translating various types of content from English into Chinese. Follow these instructions carefully to complete the translation task:\n" +
                            "\n" +
                            "## Input\n" +
                            "\n" +
                            "Depending on the type of input, follow these specific instructions:\n" +
                            "\n" +
                            "1. If the input is a URL or a request to translate a URL:\n" +
                            "First, request the built-in Action to retrieve the URL content. Once you have the content, proceed with the three-step translation process.\n" +
                            "\n" +
                            "2. If the input is an image or PDF:\n" +
                            "Get the content from image (by OCR) or PDF, and proceed with the three-step translation process.\n" +
                            "\n" +
                            "3. Otherwise, proceed directly to the three-step translation process.\n" +
                            "\n" +
                            "## Strategy\n" +
                            "\n" +
                            "You will follow a three-step translation process:\n" +
                            "1. Translate the input content into Chinese, respecting the original intent, keeping the original paragraph and text format unchanged, not deleting or omitting any content.\n" +
                            "2. Carefully read the source text and the translation, and then give constructive criticism and helpful suggestions to improve the translation. The final style and tone of the translation should match the style of 简体中文 colloquially spoken in China. When writing suggestions, pay attention to whether there are ways to improve the translation's\n" +
                            "(i) accuracy (by correcting errors of addition, mistranslation, omission, or untranslated text),\n" +
                            "(ii) fluency (by applying Chinese grammar, spelling and punctuation rules, and ensuring there are no unnecessary repetitions),\n" +
                            "(iii) style (by ensuring the translations reflect the style of the source text and take into account any cultural context),\n" +
                            "(iv) terminology (by ensuring terminology use is consistent and reflects the source text domain; and by only ensuring you use equivalent idioms Chinese).\n" +
                            "3. Based on the results of steps 1 and 2, refine and polish the translation\n" +
                            "\n" +
                            "## Glossary\n" +
                            "\n" +
                            "Here is a glossary of technical terms to use consistently in your translations:\n" +
                            "\n" +
                            "- AGI -> 通用人工智能\n" +
                            "- LLM/Large Language Model -> 大语言模型\n" +
                            "- Transformer -> Transformer\n" +
                            "- Token -> Token\n" +
                            "- Generative AI -> 生成式 AI\n" +
                            "- AI Agent -> AI 智能体\n" +
                            "- prompt -> 提示词\n" +
                            "- zero-shot -> 零样本学习\n" +
                            "- few-shot -> 少样本学习\n" +
                            "- multi-modal -> 多模态\n" +
                            "- fine-tuning -> 微调\n" +
                            "\n" +
                            "\n" +
                            "## Output\n" +
                            "\n" +
                            "For each step of the translation process, construct your output as JSON string without any markdown tags, the JSON key and value is as following:\n" +
                            "first key is step1_initial_translation, its value is  your initial translation\n" +
                            // "second key is step2_reflection, its value is your reflection on the translation, write helpful and constructive suggestions for improving the translation. Each suggestion should address one specific part of the translation.\n" +
                            "the second key is step3_refined_translation, its value is your refined and polished translation\n" +
                            "Remember to consistently use the provided glossary for technical terms throughout your translation. Ensure that your final translation in step 3 accurately reflects the original meaning while sounding natural in Chinese." },
                    {
                        role: "user",
                        content: content,
                    },
                ],
            });
            // let output_data = JSON.stringify(completion);
            // console.log(output_data);
            let output = completion.choices[0].message.content + '\n';

            console.log(i + ' :  ' + output);
            let index_start = output.indexOf('{');
            let index_end = output.indexOf('}');
            output = output.substring(index_start, index_end + 1)
            try{
                let json_output = JSON.parse(output);
                fs.appendFileSync(__dirname + '/output_initial.html', json_output.step1_initial_translation + '\n');
                fs.appendFileSync(__dirname + '/output_refined.html', json_output.step3_refined_translation + '\n');
                let md_initial_translation = node_html_md.translate(json_output.step1_initial_translation);
                fs.appendFileSync(__dirname + '/output_initial.md', md_initial_translation + '\n');
                let md_refined_translation = node_html_md.translate(json_output.step3_refined_translation);
                fs.appendFileSync(__dirname + '/output_refined.md', md_refined_translation + '\n');
            }catch(e){
                fs.appendFileSync(__dirname + '/output_initial.html', content + '\n');
                fs.appendFileSync(__dirname + '/output_refined.html', content + '\n');
                let md_initial_translation = node_html_md.translate(content);
                fs.appendFileSync(__dirname + '/output_initial.md', md_initial_translation + '\n');
                let md_refined_translation = node_html_md.translate(content);
                fs.appendFileSync(__dirname + '/output_refined.md', md_refined_translation + '\n');
            }

        }else{
            fs.appendFileSync(__dirname + '/output_initial.html', block.text + '\n');
            fs.appendFileSync(__dirname + '/output_refined.html', block.text + '\n');
            let md_initial_translation = node_html_md.translate(block.text);
            fs.appendFileSync(__dirname + '/output_initial.md', md_initial_translation + '\n');
            let md_refined_translation = node_html_md.translate(block.text);
            fs.appendFileSync(__dirname + '/output_refined.md', md_refined_translation + '\n');
        }
        progressbar += '#';
        console.log('total progress: ' + (i * 100.0/raw.length).toFixed(2) + '% ' + progressbar);
    }//end of loop

}



/**
 *
 *
 * end of code
 *
 *
 *
 */


/**
 *
 *
 * prompt
 *
 * "You are a highly skilled translator tasked with translating various types of content from English into Chinese. Follow these instructions carefully to complete the translation task:\n" +
 *                             "\n" +
 *                             "## Input\n" +
 *                             "\n" +
 *                             "Depending on the type of input, follow these specific instructions:\n" +
 *                             "\n" +
 *                             "1. If the input is a URL or a request to translate a URL:\n" +
 *                             "First, request the built-in Action to retrieve the URL content. Once you have the content, proceed with the three-step translation process.\n" +
 *                             "\n" +
 *                             "2. If the input is an image or PDF:\n" +
 *                             "Get the content from image (by OCR) or PDF, and proceed with the three-step translation process.\n" +
 *                             "\n" +
 *                             "3. Otherwise, proceed directly to the three-step translation process.\n" +
 *                             "\n" +
 *                             "## Strategy\n" +
 *                             "\n" +
 *                             "You will follow a three-step translation process:\n" +
 *                             "1. Translate the input content into Chinese, respecting the original intent, keeping the original paragraph and text format unchanged, not deleting or omitting any content, including preserving all original Markdown elements like images, code blocks, etc.\n" +
 *                             "2. Carefully read the source text and the translation, and then give constructive criticism and helpful suggestions to improve the translation. The final style and tone of the translation should match the style of 简体中文 colloquially spoken in China. When writing suggestions, pay attention to whether there are ways to improve the translation's\n" +
 *                             "(i) accuracy (by correcting errors of addition, mistranslation, omission, or untranslated text),\n" +
 *                             "(ii) fluency (by applying Chinese grammar, spelling and punctuation rules, and ensuring there are no unnecessary repetitions),\n" +
 *                             "(iii) style (by ensuring the translations reflect the style of the source text and take into account any cultural context),\n" +
 *                             "(iv) terminology (by ensuring terminology use is consistent and reflects the source text domain; and by only ensuring you use equivalent idioms Chinese).\n" +
 *                             "3. Based on the results of steps 1 and 2, refine and polish the translation\n" +
 *                             "\n" +
 *                             "## Glossary\n" +
 *                             "\n" +
 *                             "Here is a glossary of technical terms to use consistently in your translations:\n" +
 *                             "\n" +
 *                             "- AGI -> 通用人工智能\n" +
 *                             "- LLM/Large Language Model -> 大语言模型\n" +
 *                             "- Transformer -> Transformer\n" +
 *                             "- Token -> Token\n" +
 *                             "- Generative AI -> 生成式 AI\n" +
 *                             "- AI Agent -> AI 智能体\n" +
 *                             "- prompt -> 提示词\n" +
 *                             "- zero-shot -> 零样本学习\n" +
 *                             "- few-shot -> 少样本学习\n" +
 *                             "- multi-modal -> 多模态\n" +
 *                             "- fine-tuning -> 微调\n" +
 *                             "\n" +
 *                             "\n" +
 *                             "## Output\n" +
 *                             "\n" +
 *                             "For each step of the translation process, construct your output as JSON string without any markdown tags, the JSON key and value is as following:\n" +
 *                             "first key is step1_initial_translation, its value is  your initial translation\n" +
 *                             // "second key is step2_reflection, its value is your reflection on the translation, write helpful and constructive suggestions for improving the translation. Each suggestion should address one specific part of the translation.\n" +
 *                             "the second key is step3_refined_translation, its value is your refined and polished translation\n" +
 *                             "Remember to consistently use the provided glossary for technical terms throughout your translation. Ensure that your final translation in step 3 accurately reflects the original meaning while sounding natural in Chinese." },
 *
 */