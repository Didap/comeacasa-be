import type { Schema, Struct } from '@strapi/strapi';

export interface SharedIndirizzo extends Struct.ComponentSchema {
  collectionName: 'components_shared_indirizzos';
  info: {
    description: '';
    displayName: 'Indirizzo';
    icon: 'pinMap';
  };
  attributes: {
    cap: Schema.Attribute.String;
    citta: Schema.Attribute.String & Schema.Attribute.Required;
    civico: Schema.Attribute.String;
    latitudine: Schema.Attribute.Decimal;
    longitudine: Schema.Attribute.Decimal;
    provincia: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 2;
      }>;
    via_piazza: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.indirizzo': SharedIndirizzo;
    }
  }
}
