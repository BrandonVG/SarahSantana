import { SlashCommandBuilder, Role as DiscordRole, MessageFlags, ChatInputCommandInteraction } from 'discord.js';
import Role from '../../models/Role';

export default {
  data: new SlashCommandBuilder()
    .setName('configurarRolEmpleado')
    .setDescription('Establece el rol de empleado en la base de datos, necesario para identificar a los empleados y llevar su registro de horas, comando necesario si se creo el rol antes de la implementación del bot.')
    .addRoleOption(option => option.setName('rol').setDescription('El rol que se usara para los empleados').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction){
    try {
      const roleId = interaction.options.getRole('rol')?.id;
      if (!roleId) return await interaction.reply({ content: 'No se pudo obtener el rol, intenta nuevamente.', flags: MessageFlags.Ephemeral });
      await Role.update( { isEmployee: true }, { where: { roleId: roleId } } )
      await interaction.reply({ content: 'Rol asignado correctamente!!', flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al asignar el rol, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}