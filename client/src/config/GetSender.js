const GetSender = (chat, loggedUser) => {
  // console.log("logged user is ", loggedUser);
  if (!chat || !chat.users || chat.users.length === 0) {
    console.log("Error in chat or chat.users", chat);
    return ""; // Or return some default value or handle it gracefully
  }  
    
  return chat?.users[0]._id === loggedUser?.existingUser?._id
    ? chat.users[1].name
    : chat.users[0].name;
};

export default GetSender;
