import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';

const DATA_DIR = path.join(process.cwd(), 'data');

async function downloadDadosItapevi() {
  const url = 'https://meumunicipio.org.br/download-csv/3522505'; // ajustar para URL real
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = path.join(DATA_DIR, 'itapevi-dados.csv');
    await fs.writeFile(filePath, response.data);

    const texto = response.data.toString('utf-8');
    const records = parse(texto, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log('✅ Dados baixados com sucesso:', filePath);
    console.log('Registros encontrados:', records.length);
  } catch (error: any) {
    console.error('❌ Erro no download:', error?.message ?? error);
  }
}

if (require.main === module) {
  downloadDadosItapevi();
}
