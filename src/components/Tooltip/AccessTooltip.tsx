import { Box, Tag } from '@chakra-ui/react';
export const AccessTooltip = ({ children }: any) => {
  return (
    <Box p='1'>
      <Tag>{children}</Tag>
    </Box>
  );
};
