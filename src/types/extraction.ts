export interface ExtractionResult {
  documentId: string;
  document: DocumentMeta;
  fieldGroups: FieldGroup[];
}

export interface DocumentMeta {
  type: "pdf" | "image";
  sourceUrl: string;
  pageCount: number;
  pages: PageDimension[];
}

export interface PageDimension {
  pageNumber: number;
  width: number;
  height: number;
}

export interface FieldGroup {
  id: string;
  label: string;
  fields: Field[];
}

export interface Field {
  id: string;
  label: string;
  extractedValue: string;
  confidence: number;
  ocrConfidence: number;
  operatorConfirmed: boolean;
  isMissing: boolean;
  dataVersion: number;
  validationSource: ValidationSource;
  boundingBox: BoundingBox;
  tokens: TokenBox[];
}

export type ValidationSource = "none" | "ai_score" | "user" | "data_matching";

export interface BoundingBox {
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TokenBox {
  text: string;
  boundingBox: BoundingBox;
}
