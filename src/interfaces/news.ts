export interface News {
  nid: Changed[];
  uuid: Langcode[];
  vid: Changed[];
  langcode: Langcode[];
  type: Type[];
  status: DefaultLangcode[];
  title: Langcode[];
  uid: Uid[];
  created: Changed[];
  changed: Changed[];
  promote: DefaultLangcode[];
  sticky: DefaultLangcode[];
  revision_timestamp: Changed[];
  revision_uid: Uid[];
  revision_log: any[];
  revision_translation_affected: DefaultLangcode[];
  default_langcode: DefaultLangcode[];
  path: any[];
  publish_on: any[];
  unpublish_on: Changed[];
  menu_link: any[];
  body: Body[];
  field_news_image: FieldNewsImage[];
}

export interface Body {
  value: string;
  format: string;
  summary: string;
}

export interface Changed {
  value: number;
}

export interface DefaultLangcode {
  value: boolean;
}

export interface FieldNewsImage {
  target_id: number;
  alt: string;
  title: string;
  width: number;
  height: number;
  target_type: string;
  target_uuid: string;
  url: string;
}

export interface Langcode {
  value: string;
}

export interface Uid {
  target_id: number;
  target_type: string;
  target_uuid: string;
  url: string;
}

export interface Type {
  target_id: string;
  target_type: string;
  target_uuid: string;
}
