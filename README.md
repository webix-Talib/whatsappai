🤖 WhatsApp Bot
A versatile WhatsApp bot built with whatsapp-web.js that offers a wide range of features, from media downloads and AI interactions to group management and utility tools.

✨ Features
This bot is packed with functionalities to enhance your WhatsApp experience:

🎥 YouTube & Media
!yt <search>: Search YouTube for videos and get a direct link.

!mp3 <yt-link>: Download the audio (MP3) from a given YouTube video link.

!sticker: Convert an image or video (sent as media with the command caption) into a WhatsApp sticker.

!removebg: Remove the background from an image (send an image with this command as caption).

!img5 <query>: Get 5 image results for any search query.

!imdb <movie/show title>: Get detailed information about a movie or TV show (e.g., ratings, plot, cast).

!instadl <Instagram Link>: Download media (videos/reels) from Instagram.

🗣️ Voice & AI
!say <text>: Convert English text to speech.

!tts <lang> <text>: Convert text to speech in any specified language (e.g., !tts hi Namaste).

!ai <prompt>: Interact with the Gemini AI model for various queries.

!wiki <term>: Get a summary from Wikipedia for a given term.

!translate <lang> <text>: Translate text to a specified language (e.g., !translate es Hola).

!define <word>: Get the dictionary definition of a word.

!math <expression>: Evaluate a mathematical expression.

!trivia: Start a new trivia game.

👥 Group Utilities
!tagall: Mention all members in a group chat.

!kick @user: Kick a mentioned user from the group (Admin only).

!remove @user: Alias for !kick.

!welcome: Send a generic welcome message.

!broadcast <message>: Send a message to all individual chats the bot is part of (Owner only).

!mention <message>: Mention all group members with a custom message.

🔧 Admin / Group Tools
!groupinfo: Display statistics and information about the current group chat.

!antilink on/off: Enable or disable automatic removal of users who send links in the group (Admin only).

!lock: Lock the group, allowing only admins to send messages (Admin only).

!unlock: Unlock the group, allowing all members to send messages (Admin only).

!promote @user: Grant admin rights to a mentioned user (Admin only).

!demote @user: Remove admin rights from a mentioned user (Admin only).

📊 User Tools
!crypto <symbol>: Get the current price and 24-hour change for a cryptocurrency (e.g., !crypto btc).

!percentage <score> <total>: Calculate the percentage from a given score and total.

!whois: Get your own WhatsApp contact information or the information of a tagged user.

!owner: Display information about the bot's owner.

!hiddeninfo: Extract hidden metadata (EXIF) from an image (send an image with this command as caption).

!delayedmsg <time> | <message>: Schedule a message to be sent after a specified time (e.g., !delayedmsg 10s | Hello).

🚀 Installation & Setup
To get this bot running, follow these steps:

Prerequisites
Node.js: Make sure you have Node.js (v16 or higher recommended) and npm installed.

ffmpeg: Required for media processing (e.g., sticker conversion).

Windows: Download from ffmpeg.org and add to PATH.

Linux/macOS: sudo apt install ffmpeg (Debian/Ubuntu) or brew install ffmpeg (macOS).

yt-dlp: Required for YouTube and Instagram downloads.

pip install yt-dlp (Requires Python installed).

Steps
Clone the Repository:

git clone https://github.com/your-username/whatsapp-bot.git # Replace with your actual repo URL
cd whatsapp-bot

Install Dependencies:

npm install

Environment Variables (.env file):
Create a file named .env in the root directory of your project and add the following variables. Replace the placeholder values with your actual keys and numbers.

OWNER_NUMBER=+918303184622 # Your WhatsApp number with country code, no spaces
YT_API_KEY=YOUR_YOUTUBE_DATA_API_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
OMDB_API_KEY=YOUR_OMDB_API_KEY
REMOVE_BG_KEY=YOUR_REMOVE_BG_API_KEY
SERP_API_KEY=YOUR_SERP_API_KEY

YouTube Data API Key: Obtain from Google Cloud Console.

Gemini API Key: Obtain from Google AI Studio.

OMDb API Key: Obtain from omdbapi.com.

Remove.bg API Key: Obtain from remove.bg/api.

SerpAPI Key: Obtain from serpapi.com.

Run the Bot:

npm start # Or node index.js

A QR code will appear in your terminal. Scan it with WhatsApp on your phone (WhatsApp -> Linked Devices -> Link a Device).

☁️ Deployment on Replit
Replit is an excellent platform for hosting your bot.

Create a Node.js Repl: On Replit, create a new Repl and select the Node.js template.

Upload Code: Copy your index.js (or your main bot file) content into Replit's index.js file.

Install Dependencies: Replit will automatically detect and install dependencies from package.json when you run the project. If not, use the Shell tab: npm install.

Set Secrets: Use Replit's 🔒 Secrets tab (left panel) to add your environment variables (e.g., OWNER_NUMBER, YT_API_KEY, etc.). This is more secure than a .env file on Replit.

Keep Alive (24/7 Uptime):

Replit's free tier puts projects to sleep after inactivity. To keep your bot running 24/7, use an external uptime monitoring service like UptimeRobot.

Copy your Replit project's live URL (visible in the webview panel when your bot is running).

Create an HTTP(s) monitor on UptimeRobot, pasting your Replit URL and setting the interval to 5 minutes. This will periodically "ping" your bot, preventing it from sleeping.

💡 Usage
Once the bot is running and connected to your WhatsApp:

Send !menu to the bot in any chat to see a list of available commands.

Use commands directly in private chats or groups.

For commands requiring media (like !sticker or !removebg), send the image/video with the command as its caption.

🤝 Contributing
Contributions are welcome! If you have ideas for new features, improvements, or bug fixes, feel free to:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeature).

Make your changes.

Commit your changes (git commit -m 'Add new feature').

Push to the branch (git push origin feature/YourFeature).

Open a Pull Request.

📄 License
This project is open-source and available under the MIT License.

📧 Contact
For any questions or support, you can reach the owner:

Instagram: @codecguy01
