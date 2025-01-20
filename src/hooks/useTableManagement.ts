import { TablePagination } from '@/types';
import {
  getQueryParamsAsObject,
  getQueryParamsAsString,
} from '@/utils/helpers';
import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { BaseQueryFn, QueryDefinition } from '@reduxjs/toolkit/query';
import { pickBy } from 'lodash';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const useTableManagement = <TRequest, TResponse>(
  queryFunction: UseQuery<
    QueryDefinition<
      TRequest,
      BaseQueryFn<
        {
          url: string;
          method?: string | undefined;
          data?: any;
          params?: any;
        },
        unknown,
        unknown
      >,
      never,
      TResponse,
      'api'
    >
  >,
  defaultInitialParams?: any,
  ignoreQueryString?: boolean // TRUE: use query state instead of query string from URL
) => {
  const searchQueryString = useLocation().search;
  const navigate = useNavigate();

  const [queryParams, setQueryParams] = useState<any>({
    limit: 20,
    offset: 0,
    ...defaultInitialParams,
  });

  const [payload, setPayload] = useState<any>({
    limit: 20,
    offset: 0,
    ...defaultInitialParams,
  });

  const { data, isLoading, isFetching, isSuccess, currentData, refetch } =
    queryFunction(payload);

  const convertParamsToPayload = (newParams: any) => {
    try {
      const { filter, ...others } = newParams;
      if (!filter) {
        setPayload({ ...others });
        return;
      }

      // Convert the filter object into an array of arrays
      const filterArray = Object.entries(filter).map(([key, value]) => {
        if (Array.isArray(value) && value.length === 4) {
          // If value is an array of the form [string, null, from, to]
          return [
            value[0],
            value[1] || null,
            value[2] || null,
            value[3] || null,
          ];
        } else {
          // Otherwise, return [key, value]
          return [key, value];
        }
      });

      const payload = {
        ...others,
        filter: filterArray,
      };

      setPayload(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const onFiltering = (params: TRequest | null) => {
    if (!params) {
      navigate(
        `${window.location.pathname}?${getQueryParamsAsString({
          limit: 20,
          offset: 0,
        })}`
      );
    } else {
      const tmp = pickBy(
        { ...queryParams, ...params },
        (value) => value !== null && value !== undefined
      );

      const queryString = qs.stringify(tmp, {
        arrayFormat: 'brackets',
        encodeValuesOnly: true,
        strictNullHandling: true,
      });

      // If ignoreQueryString = true (not use query string from url)
      // -> DON't navigate url, just use state for query
      if (ignoreQueryString) {
        setQueryParams(tmp);
        setPayload(tmp);
        return;
      }

      navigate(`${window.location.pathname}?${queryString}`);
    }
  };

  const handleChangePagination = (
    prevPagination: TablePagination,
    currentPage: number
  ) => {
    const { pageSize } = prevPagination;

    const queryObject = {
      ...queryParams,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    };

    if (!ignoreQueryString) {
      const queryString = qs.stringify(queryObject, {
        arrayFormat: 'brackets',
        encodeValuesOnly: true,
      });
      navigate(`${window.location.pathname}?${queryString}`);
    } else {
      setQueryParams(queryObject);
      convertParamsToPayload(queryObject);
    }
  };

  useEffect(() => {
    const queryObject = qs.parse(searchQueryString.replace('?', ''));

    const { limit, offset, ...restParams } = queryObject;
    let newParams = {
      limit: 20,
      offset: 0,
      ...defaultInitialParams,
    };
    // If passing limit from url
    // ->> query with query params from URL
    // ELSE: query with default params
    if (limit !== undefined && !ignoreQueryString) {
      newParams = {
        ...restParams,
        limit: Number(limit),
        offset: Number(offset),
      };
    }
    setQueryParams(newParams);
    setPayload(newParams);
    convertParamsToPayload(newParams);
  }, [searchQueryString, ignoreQueryString]);

  useEffect(() => {
    if (!ignoreQueryString && isSuccess) {
      const element = document.getElementById('layout');

      if (element) {
        element.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [ignoreQueryString, isSuccess]);

  return {
    handleChangePagination,
    data,
    isLoading,
    isFetching,
    currentData,
    onFiltering,
    queryObject: getQueryParamsAsObject(searchQueryString),
    queryParams,
    refetch,
  };
};
