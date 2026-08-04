import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { TextRecognitionResult, VisionRepository } from 'src/application/repositories/vision';

// images.annotate requires OAuth2 (scope cloud-platform or cloud-vision) — verified against the
// API reference, it does NOT accept a plain API key despite what older tutorials suggest. Same
// service-account pattern as GooglePlayApiRepository, just a different scope.
@Injectable()
export class GoogleVisionRepository implements VisionRepository {
  private async getClient() {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY ?? '{}');
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-vision'],
    });

    return google.vision({ version: 'v1', auth });
  }

  async recognizeText(imageBase64: string): Promise<TextRecognitionResult> {
    const client = await this.getClient();
    const { data } = await client.images.annotate({
      requestBody: {
        requests: [
          {
            image: { content: imageBase64 },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          },
        ],
      },
    });

    return { text: data.responses?.[0]?.fullTextAnnotation?.text ?? '' };
  }
}
