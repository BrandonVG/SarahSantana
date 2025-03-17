import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalSubmitInteraction, TextChannel } from 'discord.js';

export default {
  data: {
    name: 'enviar_botones_local',
    description: 'Envia botones de registro',
  },
  async execute(interaction: ModalSubmitInteraction){
    const startText = interaction.fields.getTextInputValue('startButton');
    const endText = interaction.fields.getTextInputValue('endButton');
    const optionsText = interaction.fields.getTextInputValue('myHours');

    const startButton = new ButtonBuilder()
      .setCustomId('registrar_apertura')
      .setLabel(startText)
      .setStyle(ButtonStyle.Success);

    const endButton = new ButtonBuilder()
      .setCustomId('registrar_cierre')
      .setLabel(endText)
      .setStyle(ButtonStyle.Danger);

    const optionsButton = new ButtonBuilder()
      .setCustomId('consultar_horas_local')
      .setLabel(optionsText)
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(startButton, endButton, optionsButton);

    const channel = interaction.guild?.channels.cache.get(interaction.channelId ?? '');
    if (channel && channel.isTextBased()) {
      await (channel as TextChannel).send({ components: [row] });
      await interaction.reply({ content: 'Botones enviados correctamente', ephemeral: true });
    } else {
      await interaction.reply({ components: [row] });
    }
  }
}