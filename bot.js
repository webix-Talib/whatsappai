require('dotenv').config();
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
const googleTTS = require('google-tts-api');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg = require('ffmpeg-static');

const OWNER_NUMBER = process.env.OWNER_NUMBER?.replace('+', '');
const YT_API_KEY = process.env.YT_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new Client({ authStrategy: new LocalAuth() });

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('✅ Bot is ready!'));

client.on('message', async msg => {
    const command = msg.body.split(' ')[0];
    const args = msg.body.split(' ');
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const rawSender = contact.id._serialized;
    const sender = rawSender.split('@')[0];
    const owner = (process.env.OWNER_NUMBER || '').replace(/\D/g, '');
    const isOwner = sender === owner;

    if (command === '!menu') {
        msg.reply(`🤖 *Bot Commands Menu*:

🔍 *!yt <search>* — Search YouTube
🎵 *!mp3 <yt-link>* — Download YouTube MP3
🗣️ *!say <text>* — Text to Speech
📇 *!contact* — Bot creator info
🧠 *!ai <prompt>* — Ask Gemini AI
👋 *!welcome* — Manual welcome message
🦶 *!kick @user* — Kick tagged user (Admin only)
🧹 *!remove @user* — Remove tagged user (Admin only)
📢 *!broadcast <msg>* — Broadcast message (Owner only)
📚 *!wiki <term>* — Search Wikipedia
🌐 *!translate <language> <text>* — Translate text (like google translate)
📊 *!percentage <score> <total>* -- Calculate percentage
🔎 *!whois @user* — Info of user
🏷️ *!tagall* — Mention all users
🧮 *!math <expression>* — Calculate
📜 *!menu* — Show this menu`);
    }

    if (command === '!yt') {
        const searchQuery = msg.body.replace('!yt ', '').trim();
        if (!searchQuery) return msg.reply('Use: !yt <search>');
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(searchQuery)}&key=${YT_API_KEY}`;
        try {
            const { data } = await axios.get(ytUrl);
            const video = data.items?.[0];
            if (!video) return msg.reply('❌ No video found.');
            const title = video.snippet.title;
            const videoId = video.id.videoId;
            msg.reply(`🎬 *${title}*\nhttps://www.youtube.com/watch?v=${videoId}`);
        } catch (err) {
            console.error(err);
            msg.reply('❌ YouTube fetch failed.');
        }
    }



    // !mp3 command using yt-dlp
    if (command === '!mp3') {
        const url = msg.body.split(' ')[1];
        if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
            return msg.reply('❌ Please provide a valid YouTube link.\nExample: !mp3 https://youtu.be/video_id');
        }

        const id = Date.now();
        const mp3Path = path.join(__dirname, `audio_${id}.mp3`);

        const ytDlpCmd = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${mp3Path}" "${url}"`;

        exec(ytDlpCmd, async (err, stdout, stderr) => {
            if (err) {
                console.error('yt-dlp error:', stderr);
                return msg.reply('❌ Failed to download MP3.');
            }

            if (fs.existsSync(mp3Path)) {
                const media = MessageMedia.fromFilePath(mp3Path);
                await msg.reply(media);
                fs.unlinkSync(mp3Path);
            } else {
                msg.reply('❌ MP3 file not found.');
            }
        });
    }


    if (command === '!say') {
        const text = msg.body.slice(4).trim();
        if (!text) return msg.reply('Use: !say <text>');
        const url = googleTTS.getAudioUrl(text, { lang: 'en', slow: false });
        const filePath = path.join(__dirname, `tts_${Date.now()}.mp3`);
        exec(`curl "${url}" --output "${filePath}"`, async (err) => {
            if (err) return msg.reply('TTS error.');
            const media = MessageMedia.fromFilePath(filePath);
            await msg.reply(media);
            fs.unlinkSync(filePath);
        });
    }

    if (command === '!ai') {
        const prompt = msg.body.replace('!ai', '').trim();
        if (!prompt) return msg.reply('Use: !ai <your prompt>');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        try {
            const res = await axios.post(url, {
                contents: [{ parts: [{ text: prompt }] }]
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            const reply = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || '🤖 No reply.';
            msg.reply(`💬 *Gemini says:*\n${reply}`);
        } catch (error) {
            console.error('Gemini error:', error.response?.data || error.message);
            msg.reply('❌ Gemini API error.');
        }
    }

    if (command === '!broadcast') {
        if (!isOwner) return msg.reply('❌ Owner only.');
        const message = msg.body.slice(11).trim();
        if (!message) return msg.reply('Use: !broadcast <msg>');
        msg.reply('📢 Sending broadcast...');
        const chats = await client.getChats();
        let count = 0;
        for (const chat of chats) {
            if (!chat.isGroup && !chat.isArchived) {
                try {
                    await chat.sendMessage(`📢 *Admin Broadcast:*\n${message}`);
                    count++;
                } catch { }
            }
        }
        msg.reply(`✅ Sent to ${count} chats.`);
    }

    if (command === '!contact') {
        msg.reply('📞 Owner: Talib\nSystem: Asus F17\nMob: +918303184622');
    }

    if ((command === '!kick' || command === '!remove') && msg.mentionedIds.length > 0) {
        if (!chat.isGroup) return msg.reply('❌ Group only.');
        const isAdmin = chat.participants.find(p => p.id._serialized === msg.author)?.isAdmin;
        if (!isAdmin) return msg.reply('❌ Admin only.');
        for (const id of msg.mentionedIds) {
            try {
                await chat.removeParticipants([id]);
            } catch {
                msg.reply(`❌ Failed to remove @${id.split('@')[0]}`);
            }
        }
    }

    if (msg.body === '!welcome') {
        msg.reply('👋 Welcome to the group!');
    }

    if (command === '!tagall') {
        if (!chat.isGroup) return msg.reply('❌ Group only.');
        const mentions = [];
        let text = '*👥 Tagging everyone:*\n';
        for (const participant of chat.participants) {
            const c = await client.getContactById(participant.id._serialized);
            mentions.push(c);
            text += `@${c.number} `;
        }
        chat.sendMessage(text, { mentions });
    }

    if (command === '!whois' && msg.mentionedIds.length > 0) {
        const id = msg.mentionedIds[0];
        const contact = await client.getContactById(id);
        msg.reply(`👤 *User Info*\nName: ${contact.pushname || 'N/A'}\nID: ${id}`);
    }

    if (command === '!math') {
        const expression = msg.body.slice(6).trim();
        try {
            const result = eval(expression.replace(/[^-()\d/*+.]/g, ''));
            msg.reply(`🧮 Result: ${result}`);
        } catch {
            msg.reply('❌ Invalid math expression.');
        }
    }

    if (command === '!wiki') {
        const query = msg.body.slice(6).trim();
        try {
            const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
            const summary = res.data.extract || 'No summary found.';
            msg.reply(`📚 *Wikipedia Summary:*\n${summary}`);
        } catch {
            msg.reply('❌ Could not fetch from Wikipedia.');
        }
    }

    // !translate <lang> <text>
    if (command === '!translate') {
        const parts = msg.body.trim().split(' ');
        const targetLang = parts[1]?.toLowerCase();
        const textToTranslate = parts.slice(2).join(' ');

        if (!targetLang || !textToTranslate) {
            return msg.reply(`❗ Usage: !translate <lang-code> <text>\nExample: !translate hi Hello`);
        }

        try {
            const response = await axios.get('https://api.mymemory.translated.net/get', {
                params: {
                    q: textToTranslate,
                    langpair: `en|${targetLang}`
                }
            });

            const translated = response?.data?.responseData?.translatedText;
            if (!translated || translated.toLowerCase() === textToTranslate.toLowerCase()) {
                return msg.reply('❌ Could not translate. Try a different language or simpler text.');
            }

            msg.reply(`🌐 *Translated to ${targetLang}*:\n${translated}`);
        } catch (error) {
            console.error('MyMemory error:', error.message);
            msg.reply('❌ Translation failed. Please try again later.');
        }
    }

    // !percentage <obtained> <total>
    if (command === '!percentage') {
        const obtained = parseFloat(args[1]);
        const total = parseFloat(args[2]);
        if (isNaN(obtained) || isNaN(total) || total === 0) {
            return msg.reply('❗ Usage: !percentage <obtained> <total>');
        }

        const percent = ((obtained / total) * 100).toFixed(2);
        msg.reply(`🎓 You scored ${obtained} out of ${total} → *${percent}%*`);
    }
});

client.on('group_join', async (notification) => {
    const chat = await notification.getChat();
    chat.sendMessage(`👋 Welcome @${notification.id.user} to *${chat.name}*!`, {
        mentions: [await client.getContactById(notification.id.user + '@c.us')]
    });
});

client.initialize();
