import React from 'react';
import {
  Box,
  BoxProps,
  Icon,
  Stack,
  StackProps,
  useCheckbox,
  useCheckboxGroup,
  UseCheckboxGroupProps,
  UseCheckboxProps,
  useId,
  useStyleConfig,
} from '@chakra-ui/react';

// Store
import { useStore } from 'store/CreateDaoStore';

// Icons
import { FaPlus } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';

type CheckboxCardGroupProps = StackProps & UseCheckboxGroupProps;

export const CheckboxCardGroup = (props: CheckboxCardGroupProps) => {
  const { children, defaultValue, value, onChange, ...rest } = props;
  const { getCheckboxProps } = useCheckboxGroup({
    defaultValue,
    value,
    onChange,
  });

  const cards = React.useMemo(
    () =>
      React.Children.toArray(children)
        .filter<React.ReactElement<RadioCardProps>>(React.isValidElement)
        .map((card) => {
          return React.cloneElement(card, {
            checkboxProps: getCheckboxProps({
              value: card.props.value,
            }),
          });
        }),
    [children, getCheckboxProps],
  );

  return <Stack {...rest}>{cards}</Stack>;
};

interface RadioCardProps extends BoxProps {
  value: string;
  checkboxProps?: UseCheckboxProps;
}

export const CheckboxCard = (props: RadioCardProps) => {
  const { checkboxProps, children, ...rest } = props;
  const { getInputProps, getCheckboxProps, state } = useCheckbox(checkboxProps);
  const { selectAsset } = useStore();
  const id = useId(undefined, 'checkbox-card');
  const styles = useStyleConfig('RadioCard', props);

  return (
    <Box as='label' cursor='pointer' onChange={selectAsset}>
      <input {...getInputProps()} aria-labelledby={id} />
      <Box sx={styles} {...getCheckboxProps()} {...rest}>
        <Stack display='flex' direction='row' align='center'>
          <Box flex='1'>{children}</Box>
          {state.isChecked ? (
            <Icon as={FaCheck} size='sm' color='primaryGradient.900' />
          ) : (
            <Icon as={FaPlus} size='sm' color='base.400' />
          )}
        </Stack>
      </Box>
    </Box>
  );
};
