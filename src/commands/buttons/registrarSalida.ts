import { ButtonInteraction, GuildMember, GuildMemberRoleManager, MessageFlags } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';
import Employee from '../../models/Employee';
import HoursRegistry from '../../models/HoursRegistry';
import Role from '../../models/Role';

export default {
  name: 'registrarSalida',
  description: 'Registra la salida de un empleado',
  async execute(interaction: ButtonInteraction){
    try{
      const member = interaction.member as GuildMember;
      const employee = await Employee.findOne({ where: { userId: member.id } });
      const workingRole = await Role.findOne({ attributes: ['roleId'], where: { isWorking: true } });
      if (!employee) return await interaction.reply({ content: 'No estas registrado como empleado, por favor contacta a directiva para registrarte.', flags: MessageFlags.Ephemeral });
      if (!employee.isWorking) return await interaction.reply({ content: 'No estas trabajando, primero ficha tu entrada.', flags: MessageFlags.Ephemeral });
      const lastRegistry = await HoursRegistry.findOne({ where: { employeeId: employee.id }, order: [['startTime', 'DESC']] });
      if (!lastRegistry) return await interaction.reply({ content: 'No se encontro tu registro de entrada, por favor contacta a directiva.', flags: MessageFlags.Ephemeral });
      employee.isWorking = false;
      await employee.save();
      lastRegistry.endTime = new Date();
      lastRegistry.workedHours = lastRegistry.endTime.getTime() - lastRegistry.startTime.getTime();
      await lastRegistry.save();
      if (workingRole && (member.roles as GuildMemberRoleManager).cache.has(workingRole?.roleId)){
        await (member.roles as GuildMemberRoleManager).remove(workingRole.roleId);
      }
      await interaction.reply({ content: `Salida registrada correctamente, trabajaste un total de ${prettyMilliseconds(lastRegistry.workedHours, { hideYearAndDays: true, hideSeconds: true })}!`, flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al registrar la salida, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}