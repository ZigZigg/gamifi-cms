import i18next from 'i18next';

const t = (field: string, options?: object) => {
  return i18next.t(field, {
    ns: 'validation',
    label: '${label}',
    ...options,
  });
};

export const getValidateMessage = () => {
  return {
    // Common message
    required: t('required'),
    default: t('default'),
    enum: t('enum', { enum: '${enum}' }),
    whitespace: t('whitespace'),
    date: {
      format: t('date.format'),
      parse: t('date.parse'),
      invalid: t('date.invalid'),
    },
    types: {
      string: t('types', { type: '${type}' }),
      method: t('types', { type: '${type}' }),
      array: t('types', { type: '${type}' }),
      object: t('types', { type: '${type}' }),
      number: t('types', { type: '${type}' }),
      date: t('types', { type: '${type}' }),
      boolean: t('types', { type: '${type}' }),
      integer: t('types', { type: '${type}' }),
      float: t('types', { type: '${type}' }),
      regexp: t('types', { type: '${type}' }),
      email: t('types', { type: '${type}' }),
      url: t('types', { type: '${type}' }),
      hex: t('types', { type: '${type}' }),
    },
    string: {
      len: t('string.len', { len: '${len}' }),
      min: t('string.min', { min: '${min}' }),
      max: t('string.max', { max: '${max}' }),
      range: t('string.range', { min: '${min}', max: '${max}' }),
    },
    number: {
      len: t('number.len', { len: '${len}' }),
      min: t('number.min', { min: '${min}' }),
      max: t('number.max', { max: '${max}' }),
      range: t('number.range', { min: '${min}', max: '${max}' }),
    },
    array: {
      len: t('array.len', { len: '${len}' }),
      min: t('array.min', { min: '${min}' }),
      max: t('array.max', { max: '${max}' }),
      range: t('array.range', { min: '${min}', max: '${max}' }),
    },
    pattern: {
      mismatch: t('pattern.mismatch', { pattern: '${pattern}' }),
    },

    // Custom message
    passwordMatchValidator: t('passwordMatchValidator'),
    passwordSyntaxValidator: t('passwordSyntaxValidator'),
  };
};
