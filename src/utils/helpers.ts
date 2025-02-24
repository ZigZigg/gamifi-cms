import { AccessMenu, IndustryItem } from '@/types/common';
import { BusinessType } from '@/types/completion';
import {
  BookkeepingDuty,
  ChangesType,
  ReasonNonCompletionStatus,
} from '@/types/progress';
import { FormInstance } from 'antd';
import i18next from 'i18next';
import { flattenDeep } from 'lodash';

export const validateAndSanitizeValue = (
  form: FormInstance,
  field: string,
  patternTest: RegExp,
  patternSanitize: RegExp
) => {
  const inputValue = form.getFieldValue(field);
  if (!patternTest.test(inputValue)) {
    // Invalid input, replace invalid characters with an empty string
    const sanitizedValue = inputValue.replace(patternSanitize, ''); // Update the form field value with the sanitized value
    form.setFieldValue(field, sanitizedValue.toUpperCase());
  }
};

export interface IRoute {
  breadcrumbName: string;
  key: string;
  path?: string;
  children?: IRoute[];
  accessMenu?:
    | 'rewards'
    | 'reward-history'
    | 'reward-vip';
}

export const systemRoutes: IRoute[] = [
  {
    breadcrumbName: 'Quản lý phần quà',
    key: 'rewards',
    path: 'rewards',
    accessMenu: 'rewards',
  },
  {
    breadcrumbName: 'Báo cáo',
    key: 'rewadHistory',
    path: 'reward-history',
    accessMenu: 'reward-history',
  },
  {
    breadcrumbName: 'Ấn định quà tặng',
    key: 'rewardVip',
    path: 'reward-vip',
    accessMenu: 'reward-vip',
  },
];

export const flattenRoutes = (routes: IRoute[]): IRoute[] => {
  return flattenDeep(
    routes.map((route: IRoute) => {
      const { children, ...rest } = route;
      return [rest, ...(children ? flattenRoutes(children) : [])];
    })
  );
};

export const systemFlattenRoutes = flattenRoutes(systemRoutes);

export const getQueryParamsAsString = (queryObject: Record<any, any>) => {
  const queryString = new URLSearchParams(queryObject).toString();
  return queryString;
};

export const removeEmpty = (params: any) => {
  // eslint-disable-next-line prefer-const
  let defaultParams = {
    ...params,
  };

  // TODO: Check params undefined or null then remove object
  Object.keys(defaultParams).forEach((key) => {
    if (
      (typeof defaultParams[key] !== 'boolean' && !defaultParams[key]) ||
      defaultParams[key] === null ||
      defaultParams[key] === undefined ||
      (Array.isArray(defaultParams[key]) && !defaultParams[key].length)
    ) {
      delete defaultParams[key];
    }
  });
  // eslint-disable-next-line no-debugger
  return defaultParams;
};

export const mappedRequestFilter = (
  request: Record<string, any>
): Array<[string, any]> => {
  const removeEmptyRequest = removeEmpty(request) as Record<string, any>;
  return Object.entries(removeEmptyRequest).map(([key, value]) => {
    if (key === 'dateRange') {
      return [key, null, ...(value as any[])] as any;
    } else {
      return [[key, value]];
    }
  });
};

interface FormValues {
  [key: string]: string | number | boolean | undefined;
}

export const trimValues = (values: FormValues): any => {
  const trimmedValues: FormValues = {};

  for (const key in values) {
    if (Object.hasOwnProperty.call(values, key)) {
      const value = values[key];
      if (typeof value === 'string') {
        trimmedValues[key] = value.trim();
      } else {
        trimmedValues[key] = value;
      }
    }
  }

  return trimmedValues;
};

export const getQueryParamsAsObject = (urlQueryString: string) => {
  const searchParams = new URLSearchParams(urlQueryString);
  const paramsObject: any = {};

  // Iterate through the URLSearchParams and build the object
  for (const [key, value] of searchParams) {
    paramsObject[key] = value;
  }
  return paramsObject;
};

export const accessMenuWithPriority = (accessMenu: AccessMenu | undefined) => {
  const priority = [
    'humanMana',
    'progressList',
    'stopList',
    'completeList',
    'reportingData',
  ];

  if (!accessMenu) return {};

  return Object.fromEntries(
    priority.map((key) => [key, accessMenu[key as keyof AccessMenu]])
  );
};

const t = (field: string, options?: object) => {
  return i18next.t(field, { ns: 'progress', ...options });
};

export const getBookkeepingDutyValue = (
  value: BookkeepingDuty | BusinessType
): string => {
  switch (value) {
    case BookkeepingDuty.INDIVIDUAL:
      return t('book_duties.individual');
    case BookkeepingDuty.CORPORATION:
    case BusinessType.CORPORATE:
      return t('book_duties.corporation');
    default:
      return '';
  }
};

export const getChangesValue = (value: ChangesType): string => {
  switch (value) {
    case ChangesType.YES:
      return t('changes.yes');
    case ChangesType.NO:
      return t('changes.no');
    default:
      return '';
  }
};

export const getStatusReason = (value: ReasonNonCompletionStatus): string => {
  switch (value) {
    case ReasonNonCompletionStatus.DEFAULT:
      return t('reason_status.default');
    case ReasonNonCompletionStatus.ARREARS:
      return t('reason_status.arrears');
    case ReasonNonCompletionStatus.TRANSFER_PROCESSING:
      return t('reason_status.transfer_process');
    default:
      return '';
  }
};

export function getNameByCodeIndustry(
  options: IndustryItem[],
  code: string
): string | undefined {
  const option = options.find((opt) => opt.metadata.code === code);
  return option?.metadata.name;
}
