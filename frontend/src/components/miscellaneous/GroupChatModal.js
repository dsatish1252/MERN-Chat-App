import React, {useState} from 'react'
import { useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalBody, ModalFooter, FormControl, Input, Box } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const toast = useToast();

    const {user, chats, setChats} = ChatState();

    const handleSearch = async (query) =>{
        setSearch(query);
        if (!query) {
            setSearchResult([]);
            return;
        }

        try{
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
            
        }catch (error){
            toast({
                title: "Error Occured!",
                description: "Failed to Load the search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    

    const handleGroup = (userToAdd) =>{
        if(selectedUsers.includes(userToAdd )){
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }
    const handleSubmit = async() =>{
        if(selectedUsers.length < 1){
            toast({
                title: "Add Group Name and atleast 2 users",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try{

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            

            const { data } = await axios.post(`/api/chat/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u)=>u._id)),
            }, config
        );
            
            console.log(data);
            setChats([ data, ...chats]);
            onClose();

            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

        }catch(error){
            toast({
                title: "Error Occured!",
                description: "Failed to create the Group Chat",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const handleDelete = (delUser) =>{
        setSelectedUsers(selectedUsers.filter((sel)=>sel._id !== delUser._id));
    };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >Creat Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
          >
            <FormControl>
                <Input 
                placeholder='Chat Name' 
                mb={3}
                onChange = {(e)=>setGroupChatName(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <Input 
                    placeholder='Add Users eg: John, Alice' 
                    mb={1}
                    onChange = {(e)=>handleSearch(e.target.value)}
                />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((u)=>(
                    <UserBadgeItem
                    key={user._id}
                    user={u}
                    handleFunction={()=>handleDelete(u)}
                    />
                ))}
            </Box>
            {
                loading ? (
                    <p>Loading...</p>
                ) : (
                    searchResult?.slice(0,4).map((u)=>(
                        <UserListItem 
                        key={u._id} 
                        user={u}  
                        handleFunction={()=>handleGroup(u)}
                        />
                    ))
                )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal;
