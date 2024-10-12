import React from 'react'
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Container,
  Box, 
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs 
  } from "@chakra-ui/react";
import Signup from '../components/Authentication/Signup';
import Login from '../components/Authentication/Login'; 

const HomePage = () => {
  const history = useHistory();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  },[history]);

  return (
    <Container maxW='xl' centerContent>
      <Box 
      d='flex' 
      justifyContent='center'
      p={3}
      bg="white"
      borderRadius='lg'
      w='100%'
      m='40px 0 15px 0'
      borderWidth='1px'>
        <Text 
        fontSize='4xl'
        fontFamily='Work sans'
        color='black'
        textAlign='center'
        >
                  Talk-A-Tive
        </Text>
      </Box>
      <Box
        bg='white'
        p={4}
        borderRadius='lg'
        w='100%'
        borderWidth='1px'
        color='black'
      >
        <Tabs variant='soft-rounded'>
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>

      </Box>
    </Container>
  )
}

export default HomePage
