import { Icon, IconProps } from '@chakra-ui/react';
import { MdFilterList } from 'react-icons/md';

interface FilterIconProps extends IconProps {
  isOpen: boolean;
}

export const FilterIcon = (props: FilterIconProps) => {
  return <Icon aria-hidden as={MdFilterList} {...props} />;
};
