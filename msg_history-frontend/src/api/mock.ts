import type {IPaginatedChannels} from "../types/index.ts";

export const CHANNELS_MOCK: IPaginatedChannels = {
  total: 3,
  items: [
    {
      id: 101,
      title: "ИУ5",
      text: "Кафедра ИУ5 МГТУ им Баумана",
      image: "/RIP_front-end/mock_images/default.png",
      subscribers: 375,
      status: false,
    },
    {
      id: 102,
      title: "МГТУ им. Н.Э. Баумана",
      text: "Официальный канал Бауманки.Здесь вы всегда найдете самые важные новости университета, информацию про мероприятия, интересные факты и многое другое!",
      image:"/RIP_front-end/mock_images/default.png",
      subscribers: 24776,
      status: false,
    },
    {
      id: 103,
      title: "Приемная коммиссия",
      text: "Здесь вы найдете всю самую необходимую информацию, связанную с поступлением в Бауманку.",
      image:"/RIP_front-end/mock_images/default.png",
      subscribers: 23482,
      status: false,
    },
  ],
};