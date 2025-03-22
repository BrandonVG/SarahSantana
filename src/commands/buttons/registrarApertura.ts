import { ButtonInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import LocalRegistry from '../../models/LocalRegistry';
import moment from 'moment-timezone';

export default {
  data: {
    name: 'registrar_apertura',
    description: 'Registra la apertura del local',
  },
  async execute(interaction: ButtonInteraction){
    try{
      const lastRegistry = await LocalRegistry.findOne({ where: { guildId: interaction.guildId }, order: [['startTime', 'DESC']] });
      if (lastRegistry && !lastRegistry?.endTime) return await interaction.reply({ content: 'Ya estas abierto el local, no puedes registrar la apertura nuevamente.', flags: MessageFlags.Ephemeral });
      const startDate = new Date();
      const spainTime = moment(startDate).tz('Europe/Madrid').format('HH:mm');
      const openRegistry = await LocalRegistry.create({ startTime: startDate, guildId: interaction.guildId });
      const embed = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setTitle('Apertura registrada correctamente')
        .setDescription('```Nombre del local: Route 68 Garage\nHora de apertura: ' + spainTime + '```');
      const sentMessage = await interaction.reply({ embeds: [embed], fetchReply: true });
      openRegistry.messageId = sentMessage.id;
      await openRegistry.save();
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al registrar la apertura, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}