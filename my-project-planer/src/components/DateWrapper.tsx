import { Text } from '@mantine/core';

export type DateWrapperProps = {
   timestamp: number;
}

export function DateWrapper(props: DateWrapperProps) {
   const date = new Date(props.timestamp * 1000);
   
   return (
      <Text>
         {date.getDate()} {date.toLocaleString('default', { month: 'long' })} {date.getFullYear() !== (new Date()).getFullYear() && date.getFullYear()}
      </Text>
   );
}