export type TextRecognitionResult = {
  text: string;
};

export abstract class VisionRepository {
  abstract recognizeText(imageBase64: string): Promise<TextRecognitionResult>;
}
