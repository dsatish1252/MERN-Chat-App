import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { ChatState } from '../context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react'; // Importing Avatar and Tooltip from Chakra UI

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages && messages.map((m, i) => (
        <div 
          style={{ 
            display: "flex", 
            justifyContent: m.sender._id === user._id ? 'flex-end' : 'flex-start', // Align messages based on sender
            alignItems: "center" // Align items vertically
          }} 
          key={m._id}
        >
          {/* Show receiver avatar for every message they send */}
          {m.sender._id !== user._id && (
            <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                src={m.sender.pic} // Assuming sender's pic is available
              />
            </Tooltip>
          )}
          <span
            style={{
              backgroundColor: `${m.sender._id === user._id ? "#bee3f8" : "#b9f5d0"}`,
              borderRadius: "6px",
              padding: "5px 15px",
              maxWidth: "75%",
              marginTop: isSameUser(messages, m, i) ? 3 : 10,
              
            }}
          >
            {m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;

