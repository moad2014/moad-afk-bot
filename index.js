require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  Events,
  MessageFlags
} = require("discord.js");

const {
  joinVoiceChannel,
  getVoiceConnection,
  entersState,
  VoiceConnectionStatus
} = require("@discordjs/voice");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // Optional: faster command updates in one server

if (!token || !clientId) {
  console.error("Missing DISCORD_TOKEN or CLIENT_ID in environment variables.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const commands = [
  new SlashCommandBuilder()
    .setName("دخول")
    .setDescription("يدخل البوت إلى الروم الصوتي الذي أنت فيه"),
  new SlashCommandBuilder()
    .setName("خروج")
    .setDescription("يخرج البوت من الروم الصوتي")
].map(command => command.toJSON());

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(token);
  const route = guildId
    ? Routes.applicationGuildCommands(clientId, guildId)
    : Routes.applicationCommands(clientId);

  await rest.put(route, { body: commands });
  console.log("Arabic slash commands registered.");
}

client.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "دخول") {
    const member = interaction.member;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: "لازم تكون داخل روم صوتي أولاً.",
        flags: MessageFlags.Ephemeral
      });
    }

    const existing = getVoiceConnection(interaction.guildId);
    if (existing) {
      existing.destroy();
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
        selfDeaf: true,
        selfMute: true
      });

      await entersState(connection, VoiceConnectionStatus.Ready, 20_000);

      return interaction.reply({
        content: `دخلت الفويس: **${voiceChannel.name}** 🎧`,
        flags: MessageFlags.Ephemeral
      });
    } catch (error) {
      console.error("Voice join error:", error);
      const connection = getVoiceConnection(interaction.guildId);
      if (connection) connection.destroy();

      return interaction.reply({
        content: "ماقدرتش ندخل للفويس. تأكد إن عندي صلاحية Connect في الروم.",
        flags: MessageFlags.Ephemeral
      });
    }
  }

  if (interaction.commandName === "خروج") {
    const connection = getVoiceConnection(interaction.guildId);

    if (!connection) {
      return interaction.reply({
        content: "أنا مش داخل أي روم صوتي حالياً.",
        flags: MessageFlags.Ephemeral
      });
    }

    connection.destroy();
    return interaction.reply({
      content: "طلعت من الروم الصوتي. 👋",
      flags: MessageFlags.Ephemeral
    });
  }
});

client.on(Events.Error, console.error);

(async () => {
  try {
    await registerCommands();
    await client.login(token);
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
})();
