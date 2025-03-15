import { ButtonInteraction, MessageFlags } from 'discord.js';
import Employee from '../../models/Employee';
import HoursRegistry from '../../models/HoursRegistry';

export default {
  name: 'registrarSalida',
  description: 'Registra la salida de un empleado',
  async execute(interaction: ButtonInteraction){
    try{
      const user = interaction.user;
      const employee = await Employee.findOne({ where: { userId: user.id } });
      if (!employee) return await interaction.reply({ content: 'No estas registrado como empleado, por favor contacta a directiva para registrarte.', flags: MessageFlags.Ephemeral });
      if (!employee.isWorking) return await interaction.reply({ content: 'No estas trabajando, primero ficha tu entrada.', flags: MessageFlags.Ephemeral });
      const lastRegistry = await HoursRegistry.findOne({ where: { employeeId: employee.id }, order: [['startTime', 'DESC']] });
      if (!lastRegistry) return await interaction.reply({ content: 'No se encontro tu registro de entrada, por favor contacta a directiva.', flags: MessageFlags.Ephemeral });
      employee.isWorking = false;
      await employee.save();
      lastRegistry.endTime = new Date();
      lastRegistry.workedHours = parseFloat(((lastRegistry.endTime.getTime() - lastRegistry.startTime.getTime()) / (1000 * 60 * 60)).toFixed(2));
      await lastRegistry.save();
      await interaction.reply({ content: 'Entrada registrada correctamente, buen día de trabajo!', flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al registrar la entrada, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}