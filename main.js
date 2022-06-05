const { Telegraf } = require('telegraf')
const { Configuration, OpenAIApi } = require("openai");
const config = require('./config');

const openai = new OpenAIApi(new Configuration({
    apiKey: config.apiKey,
}));
const bot = new Telegraf(config.token)

bot.start((ctx) => {
    ctx.reply("Hello, this is a bot that uses OpenAI.\nAsk anything using /ask followed by your question.")
})

bot.command('ask', async (ctx) => {
    const args = ctx.update.message.text.split(" ");
    args.shift()
    let question = args.join(" ");
    if (question.length == 0) {
        return ctx.reply('Type something after /ask to ask me stuff.', {reply_to_message_id: ctx.message.message_id});
    }
    const completion = await openai.createCompletion("text-davinci-001", {
        prompt: question,
        max_tokens: 1000,
    });
    ctx.reply(completion.data.choices[0].text, {reply_to_message_id: ctx.message.message_id});
})

/* bot.command('ask', async (ctx) => {
    const completion = await openai.createCompletion("text-davinci-001", {
        prompt: match[1],
    });
    ctx.reply(completion.data.choices[0].text);
}) */

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))