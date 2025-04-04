import { ButtonInteraction, GuildMember, MessageFlags } from 'discord.js';
import { Op } from 'sequelize';
import moment from 'moment-timezone';
import HoursRegistry from '../../models/HoursRegistry'
import prettyMilliseconds from '../../utils/prettyMilliseconds';

export default {
  data: {
    name: 'consultar_horas',
    description: 'Consulta las horas trabajadas en la semana'
  },
  async execute(interaction: ButtonInteraction){
    try {
      const id = (interaction.member as GuildMember).id;
      const now = moment().tz("Europe/Madrid");
      const startMonday = now.clone().startOf('isoWeek');
      const endMonday = startMonday.clone().add(7, 'days');
      startMonday.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
      endMonday.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
      const utcStartMonday = startMonday.clone().tz('UTC');
      const utcEndMonday = endMonday.clone().tz('UTC');
      const registries = await HoursRegistry.findAll({ where: { employeeId: id, workedHours: { [Op.not]: null }, startTime: { [Op.gte]: utcStartMonday, [Op.lt]: utcEndMonday }, guildId: interaction.guildId } });
      let totalHours = registries.reduce((total, registry) => total + registry.workedHours, 0);
      const workingNowRegistry = await HoursRegistry.findOne({ where: { employeeId: id, endTime: null, guildId: interaction.guildId } });
      if (workingNowRegistry) {
        const nowUtc = new Date();
        const start = workingNowRegistry.startTime;
        const diff = nowUtc.getTime() - start.getTime();
        totalHours += diff;
      }
      await interaction.reply({ content: `Has trabajado un total de ${prettyMilliseconds(totalHours)} en la semana.`, flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al consultar las horas, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}