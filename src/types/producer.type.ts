export type ProducerRange = {
  min: ProducerInterval[];
  max: ProducerInterval[];
};

export type ProducerInterval = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};
