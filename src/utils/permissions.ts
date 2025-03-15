import Command from '../models/Command';

/**
 * Verifica si un usuario tiene permisos para ejecutar un comando
 * @param commandName - Nombre del comando
 * @param userRoles - Lista de IDs de roles del usuario
 * @returns Boolean - `true` si el usuario tiene permiso, `false` si no
 */

export async function hasPermission(commandName: string, userRoles: string[]): Promise<boolean>{
  const command = await Command.findOne({ where: { name: commandName } });
  if(!command) return false;
  if (command.roles.length === 0) return true;
  return command.roles.some((role: { roleId: string; }) => userRoles.includes(role.roleId));
}