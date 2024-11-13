export const calculateRoom = (currUserId: string, currSelectedFriend: string) =>  {
    return (+currUserId * 4) + (+currSelectedFriend * 4);
};