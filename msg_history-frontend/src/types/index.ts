export interface IChannel {
    id: number;
    title: string;
    text: string;
    image?: string;
    subscribers?: number;
    status?: boolean;
  }
  
  export interface IPaginatedChannels {
    items: IChannel[];
    total: number;
  }
  
  export interface ICrumb {
    label: string;
    path?: string;
    active?: boolean;
  }
  
  export interface ICartBadge {
      msghistory_id: number | null;
      count: number;
  }
  export interface FilterState {
    searchTerm: string;
  }
  export interface BreadcrumbsProps {
  crumbs: ICrumb[];
}

export interface ChannelCardProps {
    channel: IChannel;
}


