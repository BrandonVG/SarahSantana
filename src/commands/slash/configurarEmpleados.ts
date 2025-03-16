import { SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction } from 'discord.js';
import Employee from '../../models/Employee';
import Role from '../../models/Role';

export default {
  data: new SlashCommandBuilder()
    .setName('conf_empleados')
    .setDescription('Carga los empleados en caso de que ya existan usuarios con rol de empleado'),
    async execute(interaction: ChatInputCommandInteraction){
      try{
        console.log(interaction.guildId);
        const employeeRole = await Role.findOne({ where: { isEmployee: true, guildId: interaction.guildId } });
        if (!employeeRole) return await interaction.reply({ content: 'No se ha configurado el rol de empleado, por favor contacta a la directiva.', flags: MessageFlags.Ephemeral });
        const usersWithEmployeeRole = interaction.guild?.roles.cache.get(employeeRole.roleId)?.members.map(member => member.id) || [];
        if (usersWithEmployeeRole.length === 0) return await interaction.reply({ content: 'No hay usuarios con el rol de empleado.', flags: MessageFlags.Ephemeral });
        await Employee.bulkCreate(usersWithEmployeeRole.map(userId => ({ discordId: userId, guildId: interaction.guildId })), { ignoreDuplicates: true });
        await interaction.reply({ content: 'Empleados registrados correctamente!!', flags: MessageFlags.Ephemeral });
      }
      catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Hubo un error al registrar a los empleados, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
      }
    }
}