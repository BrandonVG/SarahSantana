import { SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction } from 'discord.js';
import Role from '../../models/Role';

export default {
  data: new SlashCommandBuilder()
    .setName('configurar_rol_trabajando')
    .setDescription('Establece el rol de trabajando en la base de datos.')
    .addRoleOption(option => option.setName('rol').setDescription('El rol que se usara para marcar que estas trabajando').setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction){
    try {
      const roleId = interaction.options.getRole('rol')?.id;
      if (!roleId) return await interaction.reply({ content: 'No se pudo obtener el rol, intenta nuevamente.', flags: MessageFlags.Ephemeral });
      await Role.update( { isWorking: true }, { where: { roleId: roleId } } )
      await interaction.reply({ content: 'Rol asignado correctamente!!', flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al asignar el rol, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}