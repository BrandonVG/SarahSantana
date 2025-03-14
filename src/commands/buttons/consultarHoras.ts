import { ButtonInteraction, GuildMember, MessageFlags } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import { Op } from 'sequelize';
import moment from 'moment-timezone';
import HoursRegistry from '../../models/HoursRegistry'

export default {
  name: 'consultarHoras',
  description: 'Consulta las horas trabajadas en la semana',
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
      const registries = await HoursRegistry.findAll({ where: { employeeId: id, startTime: { [Op.gte]: utcStartMonday, [Op.lt]: utcEndMonday } } });
      const totalHours = registries.reduce((total, registry) => total + registry.workedHours, 0);
      await interaction.reply({ content: `Has trabajado un total de ${prettyMilliseconds(totalHours, { hideYearAndDays: true, hideSeconds: true })} en la semana.`, flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al consultar las horas, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}