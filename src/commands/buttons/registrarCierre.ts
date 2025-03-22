import { ButtonInteraction, EmbedBuilder, GuildMemberRoleManager, MessageFlags } from 'discord.js';
import LocalRegistry from '../../models/LocalRegistry';
import moment from 'moment-timezone';
import prettyMilliseconds from '../../utils/prettyMilliseconds';
import Role from '../../models/Role';
import Employee from '../../models/Employee';
import HoursRegistry from '../../models/HoursRegistry';

export default {
  data: {
    name: 'registrar_cierre',
    description: 'Registra el cierre del local',
  },
  async execute(interaction: ButtonInteraction){
    try{
      const employeeRole = await Role.findOne({ where: { guildId: interaction.guildId, isEmployee: true } });
      const lastRegistry = await LocalRegistry.findOne({ where: { guildId: interaction.guildId, endTime: null }, order: [['startTime', 'DESC']] });
      if (!lastRegistry) return await interaction.reply({ content: 'No hay ningun registro de apertura, haz la apertura, si ya se hizo una apertura contacta a directiva para reportar el error', flags: MessageFlags.Ephemeral });
      const workingEmployees = await Employee.findAll({ where: { guildId: interaction.guildId, isWorking: true } });
      const workingEmployeesIds = workingEmployees.map(e => e.discordId);
      const workingEmployeesRegistries = await HoursRegistry.findAll({ where: { guildId: interaction.guildId, endTime: null, employeeId: workingEmployeesIds } });
      const endTime = new Date();
      lastRegistry.endTime = endTime;
      lastRegistry.workedHours = lastRegistry.endTime.getTime() - lastRegistry.startTime.getTime();
      await lastRegistry.save();
      for (const registry of workingEmployeesRegistries){
        registry.endTime = endTime;
        registry.workedHours = registry.endTime.getTime() - registry.startTime.getTime();
        await registry.save();
      }
      const workingRole = await Role.findOne({ attributes: ['roleId'], where: { isWorking: true, guildId: interaction.guildId } });
      for (const employee of workingEmployees){
        employee.isWorking = false;
        await employee.save();
        const member = await interaction.guild?.members.fetch(employee.discordId);
        if (workingRole && member && member.roles.cache.has(workingRole?.roleId)){
          await member.roles.remove(workingRole.roleId);
        }
      }
      const spainTime = moment(endTime).tz('Europe/Madrid').format('HH:mm');
      const embed = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setTitle('Cierre registrado correctamente')
        .addFields({ name: 'Mensaje', value: 'Taller cerrado'})
        .setDescription('```Hora de cierre: '+ spainTime  +'\nTotal de horas: ' + prettyMilliseconds(lastRegistry.workedHours) + '```');
      const closeMessage = await interaction.reply({ content: `<@&${employeeRole?.roleId}>`, embeds: [embed] });
      setTimeout(async () => {
        if (!interaction.channel) return;
        const openMessage = interaction.channel.messages.cache.get(lastRegistry.messageId ?? '');
        if (openMessage){
          lastRegistry.messageId = undefined;
          await lastRegistry.save();
          await openMessage.delete();
        }
        if (closeMessage) {
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