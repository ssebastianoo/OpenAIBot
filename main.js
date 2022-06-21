const { Telegraf } = require("telegraf");
const { Configuration, OpenAIApi } = require("openai");
const config = require("./config");

const openai = new OpenAIApi(
  new Configuration({
    apiKey: config.apiKey,
  })
);
const bot = new Telegraf(config.token);

bot.start((ctx) => {
  ctx.reply(
    "Hello, this is a bot that uses OpenAI.\nAsk anything using /ask followed by your question, if your directly texting the bot you don't need to use /ask, just ask your question."
  );
});

async function askAI(question) {
  const completion = await openai.createCompletion("text-davinci-001", {
    prompt: question,
    max_tokens: 1000,
  });
  return completion.data.choices[0].text;
}

bot.command("ask", async (ctx) => {
  if (ctx.message.chat.type == "private") {
    return ctx.reply("This bot doesn't work in private messages and can't be added in groups, comma 22 https://en.wikipedia.org/wiki/Catch-22_(logic)")
  }

  const args = ctx.update.message.text.split(" ");
  args.shift();
  let question = args.join(" ");
  if (question.length == 0) {
    return ctx.reply("Type something after /ask to ask me stuff.", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
  const completion = await askAI(question);
  ctx.reply(completion, {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
