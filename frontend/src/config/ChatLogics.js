// export const getSender = (loggedUser, users)=>{
//     return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
// }

export const getSender = (loggedUser, users) => {
    if (!users || users.length < 2 || !loggedUser) {
        console.error("Users or loggedUser is undefined");
        return "Unknown Sender"; // Fallback in case users or loggedUser is undefined
    }
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};


export const getSenderFull = (loggedUser, users)=>{
    return users[0]._id === loggedUser._id ? users[1]: users[0];
}

export const isSameSender = (messages, m, i, userId)=>{
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== userId
    );
   
}

export const isLastMessage = (messages, i, userId)=>{
    return i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id;
}


export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    m.sender._id !== userId // Ensure it's not the logged-in user's message
  ) {
    return 33; // Larger margin between consecutive messages from different users
  } else if (
    (i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id) ||
    (i === messages.length - 1 && m.sender._id !== userId)
  ) {
    return 0; // No margin for the first message or if it's the last one from the other user
  } else {
    return "auto"; // Automatically handle margin for the logged-in user's messages
  }
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};