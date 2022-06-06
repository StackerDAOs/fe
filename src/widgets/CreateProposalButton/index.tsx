import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react';

export const CreateProposalButton = ({ title }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} my={4} color='white'>
        {title}
      </Button>

      <Drawer onClose={onClose} isOpen={isOpen} size='2xl' placement='bottom'>
        <DrawerOverlay />
        <DrawerContent bg='base.800' color='light.900' p='6'>
          <DrawerCloseButton />
          <DrawerHeader>{`Create proposal`}</DrawerHeader>
          <DrawerBody>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Consequat nisl vel pretium lectus quam id. Semper quis lectus
              nulla at volutpat diam ut venenatis. Dolor morbi non arcu risus
              quis varius quam quisque. Massa ultricies mi quis hendrerit dolor
              magna eget est lorem. Erat imperdiet sed euismod nisi porta.
              Lectus vestibulum mattis ullamcorper velit.
            </p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
