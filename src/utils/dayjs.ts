import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Configurar plugins
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

// Configurar locale español
dayjs.locale('es');

export default dayjs;
export type { Dayjs };