import { 
    Button,
    Tooltip, 
    Box, 
    Text, 
    Menu, 
    MenuButton, 
    Avatar, 
    MenuList, 
    MenuItem, 
    MenuDivider, 
    Drawer,
    useDisclosure,
    DrawerOverlay,
    DrawerHeader,
    DrawerContent,
    DrawerBody,
    Input,
    useToast,
    Spinner,

} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSolid, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {BellIcon, ChevronDownIcon, chevronDownIcon} from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';


const SideDrawer = () => {

    const [search, setSearch] = useState();
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);

    const { 
        user, 
        setSelectedChat, 
        chats, setChats, 
        notification, setNotification  
    } = ChatState();
    const history = useHistory();

    const {isOpen, onOpen, onClose} = useDisclosure();

    const logoutHandler = () =>{
        localStorage.removeItem("userInfo");
        history.push("/");
    }

    const toast = useToast(); 

    const handleSearch = async () =>{
        if(!search){
            toast({
                title:"please Enter something to Search",
                status:"warning",
                duration:700,
                isClosable:true,
                position: "top-left"
            })
        }
        try{
            setLoading(true);

            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`,
                },
            };
             
            const {data} = await axios.get(`/api/user?search=${search}`,config);
            setLoading(false);
            setSearchResults(data);
        } catch (error){
            toast({
                title:"Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            });
        }
    }

    const accessChat = async (userId) =>{

        try {
            setLoadingChat(true);

            const config ={
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const {data} = await axios.post('/api/chat',{userId},config);

            if(!chats.find((c) => c._id === data._id)){
                setChats([data, ...chats]);
            } 
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        }catch(error){
            toast({
                title: "Error while Fetching Chat",
                description:error.message,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left",
            });
        }
    };

  return (
    <>
      <Box 
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            p:"5px 10px 5px 10px",
            borderWidth:"5px"
        }}
      >
        <Tooltip label="Search for users" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />  
                <Text d={{base:"none",md:"flex"}} px="4">
                    Search user
                </Text>  
            </Button>

        </Tooltip>
        <Text
            fontSize="2xl"
            fontFamily="Work sans"

        >
            Talk-A-Tive
        </Text>
        <Box display="flex" alignItems="center">
        <Menu>
            <MenuButton p={1}>
                <BellIcon 
                fontSize={"2xl"} 
                m={1} 
                color={notification.length?"red":"black"}
                />
            </MenuButton>
            <MenuList>
                {!notification.length && <MenuItem>No Notifications</MenuItem>}
                {notification.map((n)=>(
                    <MenuItem key={n._id} onClick={()=>{
                        setSelectedChat(n.chat);
                        setNotification(notification.filter((noti)=>noti._id !== n._id));
                    }}>{
                        n.isGroupChat?`New Message in ${n.chat.chatName}`:`new Message from ${getSender(user,n.chat.users)}`
                    }</MenuItem>
                ))}
            </MenuList>
            
        </Menu>
        <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
                <ProfileModel user={user}>
                    <MenuItem>My Profile</MenuItem>
                </ProfileModel>
                <MenuDivider/>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
        </Menu>
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay /> 
            <DrawerContent>
                <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
                <DrawerBody>
                <Box display="flex" paddingBottom={2}>
                    <Input
                        placeholder="Search by name or email"
                        mr={2}
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Go</Button>
                </Box>
                {loading?<ChatLoading />:
                    (
                        searchResults?.map(user=>{
                            return (
                                <UserListItem 
                                    key = {user._id}
                                    user={user}
                                    handleFunction={()=>accessChat(user._id)}
                                />
                            )
                        })
                    )
                }
                {loadingChat && <Spinner ml="auto" display="flex"/>}
            </DrawerBody>
            </DrawerContent>

            
            
      </Drawer>
    </>
  )
}

export default SideDrawer;
