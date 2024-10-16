import React from 'react'
import { 
  IconButton, 
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Modal,
  ModalBody,
  Image,
  Text
} from '@chakra-ui/react';
import {ViewIcon} from "@chakra-ui/icons";



const ProfileModel = ({user, children}) => {

    const {isOpen, onOpen, onClose} = useDisclosure();



  return (
    <>
      {children?(
            <span onClick={onOpen}>{children}</span>
        ):(
            <IconButton
                d={{base: "flex"}}
                icon={<ViewIcon />}
                onClick={onOpen}
            />
        )}

        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            style={{
              fontSize: "40px",
              fontFamily: "Work sans",
              display: "flex",
              justifyContent: "center"
            }}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
              flexDir="column"
              alignItems="center"
              justifyContent="space-between"
            
              
            
          >
            <Image
              sx={{
                borderRadius:"full",
                boxSize:"150px",
              }}
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{base:'28px', md:"30px"}}
              fontFamily={"Work sans"}
            >
              Email: {user.email}
            </Text>

            
          </ModalBody>
            
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default ProfileModel;
