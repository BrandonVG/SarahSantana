import { ButtonInteraction, EmbedBuilder, MessageFlags } from 'discord.js';
import LocalRegistry from '../../models/LocalRegistry';
import moment from 'moment-timezone';
import prettyMilliseconds from '../../utils/prettyMilliseconds';

export default {
  data: {
    name: 'registrar_cierre',
    description: 'Registra el cierre del local',
  },
  async execute(interaction: ButtonInteraction){
    try{
      const lastRegistry = await LocalRegistry.findOne({ where: { guildId: interaction.guildId }, order: [['startTime', 'DESC']] });
      if (!lastRegistry) return await interaction.reply({ content: 'No hay ningun registro de apertura, haz la apertura, si ya se hizo una apertura contacta a directiva para reportar el error', flags: MessageFlags.Ephemeral });
      const endTime = new Date();
      lastRegistry.endTime = endTime;
      lastRegistry.workedHours = lastRegistry.endTime.getTime() - lastRegistry.startTime.getTime();
      await lastRegistry.save();
      const spainTime = moment(endTime).tz('Europe/Madrid').format('HH:mm');
      const embed = new EmbedBuilder()
      .setColor("#FFFFFF")
      .setTitle('Cierre registrado correctamente')
      .setDescription('```Hora de cierre: '+ spainTime  +'\nTotal de horas: ' + prettyMilliseconds(lastRegistry.workedHours) + '```');
      const closeMessage = await interaction.reply({ embeds: [embed] });
      setTimeout(async () => {
        if (!interaction.channel) return;
        console.log('Deleting messages');
        console.log(lastRegistry.messageId);
        const openMessage = interaction.channel.messages.cache.get(lastRegistry.messageId ?? '');
        if (openMessage){
          console.log('Deleting open message');
          lastRegistry.messageId = undefined;
          await lastRegistry.save();
          await openMessage.delete();
        }
        if (closeMessage) {
          console.log('Deleting close message');
          await closeMessage.delete();
        }
      }, 60000);
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al registrar el cierre, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}