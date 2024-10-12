import React,{useState} from 'react'
import { Box, FormControl, IconButton, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';


const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
  
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);   
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();
    const {selectedChat, setSelectedChat, user} = ChatState();

    const handleRemove = async (user1) =>{

        // if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {

        //     toast({
        //         title: "Only Admin can remove users",
        //         status: "error",
        //         duration: 5000,
        //         isClosable: true,
        //         position: "bottom",
        //     });
        //     return;
        // }

        // try{

        //     setLoading(true);
        //     const config = {
        //         headers:{
        //             Authorization:`Bearer ${user.token}`,
        //         },
        //     };

        //     const {data} = await axios.put(
        //         `/api/chat/groupremove`,
        //         {
        //             chatId:selectedChat._id,
        //             userId:user1._id,
        //         },
        //         config
        //     );

        //     user1._id === user._id ? selectedChat(): setSelectedChat(data);
        //     setFetchAgain(!fetchAgain);
        //     setLoading(false);

        // }catch(error){

        //     toast({
        //         title:"Error Occured!",
        //         description: error.response.data.message,
        //         status: "error",
        //         duration: 5000,
        //         isClosable: true,
        //         position: "bottom",
        //     });
        //     setLoading(false);

        // }

        
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
            title: "Only Admin can remove users",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
            };

            // API call to remove user from the group
            const response = await axios.put(
            `/api/chat/groupremove`,
            {
                chatId: selectedChat._id,
                userId: user1._id, // Fixed user1._Id to user1._id
            },
            config
            );

            // Ensure response contains data before proceeding
            if (response && response.data) {
            const { data } = response; // Extract data safely

            if (user1._id === user._id) {
                setSelectedChat(); // Clear selected chat if the user is removing themselves
            } else {
                setSelectedChat(data); // Update chat with the response data
            }

            setFetchAgain(!fetchAgain); // Trigger a re-fetch
            } else {
            throw new Error('Invalid response from the server');
            }
            fetchMessages();
            setLoading(false);
            setSelectedChat(); // Clear selected chat
            setSearchResult([]); // Clear search results
            toast({
            title: "User removed from the group",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            });
            

        } catch (error) {
            // Improved error logging and toast message
            console.error("Error removing user:", error);
            toast({
            title: "Error Occurred!",
            description: error.response?.data?.message || error.message || "Something went wrong!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            });
            setLoading(false);
        }



    }

    const handleAddUser = async(user1) =>{

        if (selectedChat.users.includes(user1)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only Admin can Add Users",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try{

            setLoading(true);

            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const {data} = await axios.put(
                `/api/chat/groupadd`,{
                    chatId:selectedChat,
                    userId:user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        }catch(error){

            toast({
                title:"Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);

        }

    }

    const handleRename = async () =>{
        if (!groupChatName) return;

        try{
            setRenameLoading(true);

            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,
                }
            };
            const {data } = await axios.put(
                `/api/chat/rename`, 
                {
                    chatId: selectedChat._id,
                    chatName:groupChatName
                }, 
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        }catch(error){
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async(query) =>{

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

    }

    

    return (
    <>
        <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody> 
            <Box
                width="100%"
                display="flex"
                flexWrap="wrap"
                pb={3}
            >
                {
                    selectedChat.users.map((u)=>(
                        <UserBadgeItem
                            key={user._id}
                            user={u}
                            handleFunction={()=>handleRemove(u)}
                            />
                    ))
                }
            </Box>
            <FormControl display="flex">
                <Input
                    placeholder='Chat Name'
                    value={groupChatName}
                    mb={3}
                    onChange={(e)=>setGroupChatName(e.target.value)}
                />
                <Button
                    varient="solid"
                    colorScheme='teal'
                    ml={1}
                    isLoading={renameLoading}
                    onClick={handleRename}
                >
                    Update
                </Button>
                
            </FormControl>
            <FormControl>
                <Input 
                    placeholder='Add User to group'
                    mb={1}
                    onChange={(e)=>handleSearch(e.target.value)}
                />
            </FormControl>
            {
                loading?(
                    <Spinner size="lg" />
                ):(
                    searchResult?.map((user)=>(
                        <UserListItem 
                            key={user._id}
                            user={user}
                            handleFunction={()=>handleAddUser(user)}
                        />
                    ))
                )
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red'  onClick={()=>handleRemove(user)}>
                Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </>
  )
}

export default UpdateGroupChatModal
