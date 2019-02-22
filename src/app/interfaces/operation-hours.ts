export interface OperationHours {
  nid: Changed[];
  uuid: Langcode[];
  vid: Changed[];
  langcode: Langcode[];
  type: Type[];
  status: DefaultLangcode[];
  title: Langcode[];
  uid: FieldCounterType[];
  created: Changed[];
  changed: Changed[];
  promote: DefaultLangcode[];
  sticky: DefaultLangcode[];
  revision_timestamp: Changed[];
  revision_uid: FieldCounterType[];
  revision_log: Langcode[];
  revision_translation_affected: DefaultLangcode[];
  default_langcode: DefaultLangcode[];
  path: any[];
  publish_on: any[];
  unpublish_on: any[];
  menu_link: any[];
  body: Body[];
  field_counter_type: FieldCounterType[];
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

export interface FieldCounterType {
  target_id: number;
  target_type: string;
  target_uuid: string;
  url: string;
}

export interface Langcode {
  value: string;
}

export interface Type {
  target_id: string;
  target_type: string;
  target_uuid: string;
}
