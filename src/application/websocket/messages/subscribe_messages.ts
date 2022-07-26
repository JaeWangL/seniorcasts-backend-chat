export type JoinRoomMessage = {
  roomId: string;
};

export type SendMessageMessage = {
  roomId: string;
  message: string;
};
