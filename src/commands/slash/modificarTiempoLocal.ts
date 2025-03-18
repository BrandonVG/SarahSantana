import { SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction } from 'discord.js';
import LocalRegistry from '../../models/LocalRegistry';

export default {
  data: new SlashCommandBuilder()
    .setName('modificar_tiempo_local')
    .setDescription('agrega o quita tiempo al local, especificado en horas o minutos')
    .addStringOption(option => 
      option
        .setName('time_type')
        .setDescription('Seleccionar horas o minutos')
        .setRequired(true)
        .addChoices(
          {name: 'Horas', value: 'hours'},
          {name: 'Minutos', value: 'minutes'}
        )
    )
    .addNumberOption(option =>
      option
        .setName('time')
        .setDescription('Cantidad númerica de tiempo a agregar, solamente un número entero, ej "1" o "30" o "-10"')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction){
    try {
      const timeType = interaction.options.getString('time_type', true);
      const time = interaction.options.getNumber('time', true);
      let milisecondsTime = 0;
      if (timeType === 'hours') {
        milisecondsTime = time * 60 * 60 * 1000;
      }
      else {
        milisecondsTime = time * 60 * 1000;
      }
      const now = new Date();
      await LocalRegistry.create({ startTime: now, endTime: now, workedHours: milisecondsTime, guildId: interaction.guildId });
      await interaction.reply({ content: 'Tiempo modificado para el local con exito :)', flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al agregar tiempo al local, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}