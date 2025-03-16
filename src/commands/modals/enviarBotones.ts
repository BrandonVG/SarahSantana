import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalSubmitInteraction } from 'discord.js';

export default {
  data: {
    name: 'enviar_botones',
    description: 'Envia botones de registro',
  },
  async execute(interaction: ModalSubmitInteraction){
    const startText = interaction.fields.getTextInputValue('startButton');
    const endText = interaction.fields.getTextInputValue('endButton');
    const optionsText = interaction.fields.getTextInputValue('myHours');

    const startButton = new ButtonBuilder()
      .setCustomId('registrar_entrada')
      .setLabel(startText)
      .setStyle(ButtonStyle.Success);

    const endButton = new ButtonBuilder()
      .setCustomId('registrar_salida')
      .setLabel(endText)
      .setStyle(ButtonStyle.Danger);

    const optionsButton = new ButtonBuilder()
      .setCustomId('consultar_horas')
      .setLabel(optionsText)
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(startButton, endButton, optionsButton);

    await interaction.reply({ components: [row] });
  }
}