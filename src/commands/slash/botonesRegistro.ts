import { SlashCommandBuilder, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('botones_registro')
    .setDescription('Enviar botones de registro'),
  async execute(interaction: ChatInputCommandInteraction){
    const modal = new ModalBuilder()
      .setCustomId('enviar_botones')
      .setTitle('Texto de botones');

    const startButtonInput = new TextInputBuilder()
      .setCustomId('startButton')
      .setLabel('Texto del botón de inicio')
      .setPlaceholder('Escribe el texto del botón de inicio')
      .setStyle(TextInputStyle.Short);

    const endButtonInput = new TextInputBuilder()
      .setCustomId('endButton')
      .setLabel('Texto del botón de fin')
      .setPlaceholder('Escribe el texto del botón de fin')
      .setStyle(TextInputStyle.Short);

    const myHoursInput = new TextInputBuilder()
      .setCustomId('myHours')
      .setLabel('Texto del botón de mis horas')
      .setPlaceholder('Escribe el texto del botón de mis horas')
      .setStyle(TextInputStyle.Short);

      const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(startButtonInput);
      const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(endButtonInput);
      const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(myHoursInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);

    await interaction.showModal(modal);
  }
}