export type ScanToken = {
  text: string;
  wordId: string | null;
  reading: string | null;
};

export type ScanResult = {
  scanId: string;
  userId: string;
  imageUrl: string;
  recognizedText: string;
  tokens: ScanToken[];

  createdAt: Date;
};
