import { SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Table } from 'embed-table';
import prettyMilliseconds from '../../utils/prettyMilliseconds';
import getWeekHours from '../../utils/getWeekHours';

export default {
  data: new SlashCommandBuilder()
    .setName('horas_semanales')
    .setDescription('Ver las horas de la semana de los empleados'),
  async execute(interaction: ChatInputCommandInteraction){
    try {
      const { totalHours, hoursGroupedEmployee } = await getWeekHours(interaction);
      const table = new Table({
        titles: ['Empleado', 'Horas trabajadas'],
        titleIndexes: [0, 48],
        columnIndexes: [0, 25],
        start: '`',
        end: '`',
        padEnd: 3,
      });

      for (const [employeeId, hours] of Object.entries(hoursGroupedEmployee)) {
        const employee = interaction?.guild?.members.cache.get(employeeId);
        if (employee) {
          table.addRow([employee.displayName, prettyMilliseconds(hours), `${((hours / totalHours) * 100).toFixed(2)}%`]);
        }
      }

      const embed = new EmbedBuilder()
        .setColor("#FFFFFF")
        .setTitle('Horas trabajadas de la semana')
        .setFields(table.toField());

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
    catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Hubo un error al verificar las horas semanales, intenta más tarde o avisa a directiva del error.', flags: MessageFlags.Ephemeral });
    }
  }
}