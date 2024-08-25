import { format, parse } from 'date-fns';

export default function FormatData(data: any) {
  const parsedDate = parse(data, 'dd-MM-yyyy', new Date());
  const formattedDate = format(parsedDate, 'yyyy-MM-dd');
  return new Date(formattedDate);
}
