import { SlashCommandBuilder, MessageFlags, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Table } from 'embed-table';
import prettyMilliseconds from '../../utils/prettyMilliseconds';
import getWeekHours from '../../utils/getWeekHours';

export default {
  data: new SlashCommandBuilder()
    .setName('calcular_primas')
    .setDescription('Ver las primas de la semana de los empleados')
    .addStringOption(option => 
      option
        .setName('redondear')
        .setDescription('Redondear horas')
        .setRequired(true)
        .addChoices(
          {name: 'Sí', value: 'yes'},
          {name: 'No', value: 'no'}
        )
    )
    .addNumberOption(option =>
      option
        .setName('prima')
        .setDescription('Cantidad númerica de la prima, solamente un número entero, ej "25000" o "30000" o "120000"')
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName('tiempo_minimo')
        .setDescription('Cantidad minima de horas para merecer obtener, solamente un número entero, ej "10" o "8"')
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction){
    try {
      const roundTime = interaction.options.getString('redondear', true) == 'yes';
      const bonus = interaction.options.getNumber('prima', true);
      const minTimeMs = interaction.options.getNumber('tiempo_minimo', true) * 60 * 60 * 1000;
      const { totalHours, hoursGroupedEmployee } = await getWeekHours(interaction, minTimeMs, roundTime);
      const table = new Table({
        titles: ['Empleado', 'Horas trabajadas', 'Porcentaje', 'Bono'],
        titleIndexes: [0, 38, 61, 81],
        columnIndexes: [0, 21, 39, 52],
        start: '`',
        end: '`',
        padEnd: 3,
      });

      for (const [employeeId, hours] of Object.entries(hoursGroupedEmployee)) {
        const employee = interaction?.guild?.members.cache.get(employeeId);
        if (employee) {
          table.addRow([employee.displayName, prettyMilliseconds(hours), `${((hours / totalHours) * 100).toFixed(2)}%`, `${((hours / totalHours) * bonus).toFixed(0)}`]);
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