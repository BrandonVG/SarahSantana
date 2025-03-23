import moment from 'moment';
import WeekHours from '../interfaces/WeekHoursInterface';
import HoursRegistry from '../models/HoursRegistry';
import { Op } from 'sequelize';
import { ChatInputCommandInteraction } from 'discord.js';

export default async function getWeekHours(interaction: ChatInputCommandInteraction, minTime?: number, round = false): Promise<WeekHours> {
  const now = moment().tz("Europe/Madrid");
  const nowUtcDate = now.clone().tz('UTC').toDate();
  const startMonday = now.clone().startOf('isoWeek');
  const endMonday = startMonday.clone().add(7, 'days');
  startMonday.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
  endMonday.set({ hour: 8, minute: 0, second: 0, millisecond: 0 });
  const utcStartMonday = startMonday.clone().tz('UTC');
  const utcEndMonday = endMonday.clone().tz('UTC');
  const registries = await HoursRegistry.findAll({ where: { workedHours: { [Op.not]: null }, startTime: { [Op.gte]: utcStartMonday, [Op.lt]: utcEndMonday }, guildId: interaction.guildId } });
  const workingNowRegistries = await HoursRegistry.findAll({ where: { endTime: null, guildId: interaction.guildId } });
  const allRegistries = [...registries, ...workingNowRegistries];
  const hoursGroupedEmployee = allRegistries.reduce((acc, registry) => {
    if (!acc[registry.employeeId]) {
      acc[registry.employeeId] = 0;
    }
    if (registry.workedHours && registry.endTime){
      acc[registry.employeeId] += registry.workedHours;
    }
    else {
      const start = registry.startTime;
      const diff = nowUtcDate.getTime() - start.getTime();
      acc[registry.employeeId] += diff;
    }
    return acc;
  }, {} as Record<string, number>);

  if (round) {
    for (const [employeeId, hours] of Object.entries(hoursGroupedEmployee)) {
      const totalMin = hours / (1000 * 60);
      const hoursFloor = Math.floor(totalMin / 60);
      const minutes = Math.round(totalMin % 60);
      const roundedHours = minutes >= 30 ? hoursFloor + 1 : hoursFloor;
      hoursGroupedEmployee[employeeId] = roundedHours * 1000 * 60 * 60;
    }
  }

  if (minTime) {
    for (const [employeeId, hours] of Object.entries(hoursGroupedEmployee)) {
      if (hours < minTime) {
        delete hoursGroupedEmployee[employeeId];
      }
    }
  }

  const totalHours = Object.values(hoursGroupedEmployee).reduce((total, hours) => total + hours, 0);

  return { totalHours, hoursGroupedEmployee };
}