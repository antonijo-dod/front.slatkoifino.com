export interface ProviderMetadata {
  public_id: string;
  resource_type: string;
}

export interface ImageFormatDetail {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata: ProviderMetadata;
}

export interface ImageFormats {
  thumbnail: ImageFormatDetail;
  // You can add other optional formats if your Strapi configuration has them
  // small?: ImageFormatDetail;
  // medium?: ImageFormatDetail;
  // large?: ImageFormatDetail;
}
