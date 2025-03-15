import Command from '../models/Command';
import Role from '../models/Role';

/**
 * Verifica si un usuario tiene permisos para ejecutar un comando
 * @param commandName - Nombre del comando
 * @param userRoles - Lista de IDs de roles del usuario
 * @param guildId - Id del guild del usuario
 * @returns Boolean - `true` si el usuario tiene permiso, `false` si no
 */

export async function hasPermission(commandName: string, userRoles: string[], guildId: string): Promise<boolean>{
  const command = await Command.findOne( { include: [Role], where: { name: commandName } } );
  if(!command) return true;
  if (command.roles.length === 0) return true;
  const rolesOfTheGuild = command.roles.filter((role: Role) => role.guildId === guildId);
  if (rolesOfTheGuild.length === 0) return true;
  return rolesOfTheGuild.some((role: { roleId: string}) => userRoles.includes(role.roleId));
}