import { SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction } from 'discord.js';
import Command from '../../models/Command';
import Role from '../../models/Role';

export default {
  data: new SlashCommandBuilder()
    .setName('configurar_permisos_rol')
    .setDescription('Establece que roles pueden ejecutar un comando, si no se configura cualquiera podra ejecutarlo')
    .addStringOption(option => option.setName('comando').setDescription('El nombre del comando que se quiere configurar').setRequired(true).addChoices(
      { name: "consultar_horas", value: "consultar_horas" },
      { name: "registrar_entrada", value: "registrar_entrada" },
      { name: "registrar_salida", value: "registrar_salida" },
      { name: "conf_empleados", value: "conf_empleados" },
      { name: "configurar_permisos_rol", value: "configurar_permisos_rol" },
      { name: "configurar_rol_empleado", value: "configurar_rol_empleado" },
      { name: "configurar_roles", value: "configurar_roles" },
      { name: "configurar_rol_trabajando", value: "configurar_rol_trabajando" },
    ))
    .addStringOption((option) =>
      option
        .setName('roles')
        .setDescription('Menciona los roles que tendrán permiso (ej: @Admin @Mod)')
        .setRequired(true)
    ),
    async execute(interaction: ChatInputCommandInteraction){
      try{
        const commandName = interaction.options.getString('comando', true);
        const dbCommand = await Command.findOne( { include: [Role], where: { name: commandName } } );
        if (!dbCommand) return await interaction.reply({ content: 'No se pudo obtener el comando, intenta nuevamente.', flags: MessageFlags.Ephemeral });
        const rolesString = interaction.options.getString('roles', true);
        const roleIds: string[] = [];
        const roleMentions = rolesString.match(/<@&(\d+)>/g);

        if (roleMentions) {
          for (const mention of roleMentions) {
            const roleId = mention.replace(/\D/g, ''); // Extrae solo el ID numérico
            if (interaction.guild?.roles.cache.has(roleId)) {
              roleIds.push(roleId);
            }
          }
        }

        if (roleIds.length === 0) return await interaction.reply({ content: 'No se pudo obtener los roles, intenta nuevamente.', flags: MessageFlags.Ephemeral });
        const roles = await Role.findAll({ where: { roleId: roleIds, guildId: interaction.guildId } });
        await dbCommand.$set('roles', []);
        await dbCommand.$add('roles', roles);
        await interaction.reply({ content: 'Permisos asignados correctamente!!', flags: MessageFlags.Ephemeral });
      }
      catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Hubo un error al asignar los permisos, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
      }
    }
}