import { ButtonInteraction, MessageFlags } from 'discord.js';
import Employee from '../../models/Employee';
import HoursRegistry from '../../models/HoursRegistry';

export default {
  name: 'registrarEntrada',
  description: 'Registra la entrada de un empleado',
  async execute(interaction: ButtonInteraction){
    try{
      const user = interaction.user;
      const employee = await Employee.findOne({ where: { userId: user.id } });
      if (!employee) return await interaction.reply({ content: 'No estas registrado como empleado, por favor contacta a directiva para registrarte.', flags: MessageFlags.Ephemeral });
      if (employee.isWorking) return await interaction.reply({ content: 'Ya estas trabajando, no puedes registrar tu entrada nuevamente.', flags: MessageFlags.Ephemeral });
      employee.isWorking = true;
      await employee.save();
      await HoursRegistry.create({ employeeId: employee.id, startTime: new Date() });
      await interaction.reply({ content: 'Entrada registrada correctamente, buen día de trabajo!', flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al registrar la entrada, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}