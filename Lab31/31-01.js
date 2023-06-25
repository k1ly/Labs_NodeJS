import TelegramBot from 'node-telegram-bot-api';

let bot = new TelegramBot('**********:***********************************', {polling: true});

bot.on('message', msg => {
    bot.sendMessage(msg.chat.id, `echo: ${msg.text}`);
});

bot.on('polling_error', error => {
    console.error(`Telegram bot error: ${error}`);
});