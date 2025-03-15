import { ButtonInteraction, GuildMember, GuildMemberRoleManager, MessageFlags } from 'discord.js';
import Employee from '../../models/Employee';
import HoursRegistry from '../../models/HoursRegistry';
import Role from '../../models/Role';

export default {
  data: {
    name: 'registrar_entrada',
    description: 'Registra la entrada de un empleado',
  },
  async execute(interaction: ButtonInteraction){
    try{
      const member = interaction.member as GuildMember;
      const employee = await Employee.findOne({ where: { discordId: member.id, guildId: interaction.guildId } });
      const workingRole = await Role.findOne({ attributes: ['roleId'], where: { isWorking: true, guildId: interaction.guildId } });
      if (!employee) return await interaction.reply({ content: 'No estas registrado como empleado, por favor contacta a directiva para registrarte.', flags: MessageFlags.Ephemeral });
      if (employee.isWorking) return await interaction.reply({ content: 'Ya estas trabajando, no puedes registrar tu entrada nuevamente.', flags: MessageFlags.Ephemeral });
      employee.isWorking = true;
      await employee.save();
      await HoursRegistry.create({ employeeId: employee.id, startTime: new Date(), guildId: interaction.guildId });
      if (workingRole && !(member.roles as GuildMemberRoleManager).cache.has(workingRole?.roleId)){
        await (member.roles as GuildMemberRoleManager).add(workingRole.roleId);
      }
      await interaction.reply({ content: 'Entrada registrada correctamente, buen día de trabajo!', flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al registrar la entrada, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}