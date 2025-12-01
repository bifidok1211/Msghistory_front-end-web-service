/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsCartBadgeDTO {
  count?: number;
  msghistory_id?: number;
}

export interface DsChannelCreateRequest {
  subscribers?: number;
  text: string;
  title: string;
}

export interface DsChannelDTO {
  id?: number;
  image?: string;
  status?: boolean;
  subscribers?: number;
  text?: string;
  title?: string;
}

export interface DsChannelInMsghistoryDTO {
  channel_id?: number;
  image?: string;
  repost_level?: number;
  subscribers?: number;
  text?: string;
  title?: string;
  views?: number;
}

export interface DsChannelToMsghistoryUpdateRequest {
  repost_level?: number;
  views?: number;
}

export interface DsChannelUpdateRequest {
  subscribers?: number;
  text?: string;
  title?: string;
}

export interface DsLoginResponse {
  token?: string;
  user?: DsUserDTO;
}

export interface DsMsghistoryDTO {
  channels?: DsChannelInMsghistoryDTO[];
  coefficient?: number;
  complition_date?: string;
  coverage?: number;
  creation_date?: string;
  creator_login?: number;
  description?: string;
  forming_date?: string;
  id?: number;
  moderator_login?: number;
  status?: number;
}

export interface DsMsghistoryResolveRequest {
  /** "complete" | "reject" */
  action: string;
}

export interface DsMsghistoryUpdateRequest {
  description?: string;
}

export interface DsPaginatedResponse {
  items?: any;
  total?: number;
}

export interface DsUserDTO {
  full_name?: string;
  id?: number;
  moderator?: boolean;
  username?: string;
}

export interface DsUserLoginRequest {
  password: string;
  username: string;
}

export interface DsUserRegisterRequest {
  full_name: string;
  password: string;
  username: string;
}

export interface DsUserUpdateRequest {
  full_name?: string;
  password?: string;
  username?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API для системы Msghistory
 * @version 1.0
 * @contact API Support <support@example.com>
 *
 * API-сервер для управления заявками и факторами риска в системе Msghistory.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * @description Получение JWT токена по логину и паролю для доступа к защищенным эндпоинтам.
     *
     * @tags auth
     * @name LoginCreate
     * @summary Аутентификация пользователя (все)
     * @request POST:/auth/login
     * @response `200` `DsLoginResponse` OK
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Неверные учетные данные
     */
    loginCreate: (
      credentials: DsUserLoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsLoginResponse, Record<string, string>>({
        path: `/auth/login`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Добавляет текущий JWT токен в черный список, делая его недействительным. Требует авторизации.
     *
     * @tags auth
     * @name LogoutCreate
     * @summary Выход из системы (авторизованный пользователь)
     * @request POST:/auth/logout
     * @secure
     * @response `200` `Record<string,string>` Сообщение об успехе
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/auth/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),
  };
  channels = {
    /**
     * @description Возвращает постраничный список каналов риска.
     *
     * @tags channels
     * @name ChannelsList
     * @summary Получить список каналов (все)
     * @request GET:/channels
     * @response `200` `DsPaginatedResponse` OK
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    channelsList: (
      query?: {
        /** Фильтр по названию канала */
        title?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsPaginatedResponse, Record<string, string>>({
        path: `/channels`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новую запись о канале риска.
     *
     * @tags channels
     * @name ChannelsCreate
     * @summary Создать новый канал (только модератор)
     * @request POST:/channels
     * @secure
     * @response `201` `DsChannelDTO` Created
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен (не модератор)
     */
    channelsCreate: (
      channelData: DsChannelCreateRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsChannelDTO, Record<string, string>>({
        path: `/channels`,
        method: "POST",
        body: channelData,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает детальную информацию о канале риска.
     *
     * @tags channels
     * @name ChannelsDetail
     * @summary Получить один канал по ID (все)
     * @request GET:/channels/{id}
     * @response `200` `DsChannelDTO` OK
     * @response `404` `Record<string,string>` Фактор не найден
     */
    channelsDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsChannelDTO, Record<string, string>>({
        path: `/channels/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет информацию о существующем канале риска.
     *
     * @tags channels
     * @name ChannelsUpdate
     * @summary Обновить канал (только модератор)
     * @request PUT:/channels/{id}
     * @secure
     * @response `200` `DsChannelDTO` OK
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    channelsUpdate: (
      id: number,
      updateData: DsChannelUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsChannelDTO, Record<string, string>>({
        path: `/channels/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет канал риска из системы.
     *
     * @tags channels
     * @name ChannelsDelete
     * @summary Удалить канал (только модератор)
     * @request DELETE:/channels/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    channelsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/channels/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Загружает и привязывает изображение к каналу риска.
     *
     * @tags channels
     * @name ImageCreate
     * @summary Загрузить изображение для канала (только модератор)
     * @request POST:/channels/{id}/image
     * @secure
     * @response `200` `Record<string,string>` URL загруженного изображения
     * @response `400` `Record<string,string>` Файл не предоставлен
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    imageCreate: (
      id: number,
      data: {
        /** Файл изображения */
        file: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/channels/${id}/image`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),
  };
  msghistory = {
    /**
     * @description Возвращает отфильтрованный список всех сформированных заявок (кроме черновиков и удаленных).
     *
     * @tags msghistory
     * @name MsghistoryList
     * @summary Получить список заявок (авторизованный пользователь)
     * @request GET:/msghistory
     * @secure
     * @response `200` `(DsMsghistoryDTO)[]` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    msghistoryList: (
      query?: {
        /** Фильтр по статусу заявки */
        status?: number;
        /** Фильтр по дате 'от' (формат YYYY-MM-DD) */
        from?: string;
        /** Фильтр по дате 'до' (формат YYYY-MM-DD) */
        to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsMsghistoryDTO[], Record<string, string>>({
        path: `/msghistory`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает ID черновика текущего пользователя и количество каналов в нем.
     *
     * @tags msghistory
     * @name ChannelscartList
     * @summary Получить информацию для иконки корзины (авторизованный пользователь)
     * @request GET:/msghistory/channelscart
     * @secure
     * @response `200` `DsCartBadgeDTO` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    channelscartList: (params: RequestParams = {}) =>
      this.request<DsCartBadgeDTO, Record<string, string>>({
        path: `/msghistory/channelscart`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Находит или создает черновик заявки для текущего пользователя и добавляет в него канал.
     *
     * @tags channels
     * @name DraftChannelsCreate
     * @summary Добавить канал в черновик заявки (все)
     * @request POST:/msghistory/draft/channels/{channel_id}
     * @secure
     * @response `201` `Record<string,string>` Сообщение об успехе
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    draftChannelsCreate: (channelId: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, Record<string, string>>({
        path: `/msghistory/draft/channels/${channelId}`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает полную информацию о заявке, включая привязанные каналы.
     *
     * @tags msghistory
     * @name MsghistoryDetail
     * @summary Получить одну заявку по ID (авторизованный пользователь)
     * @request GET:/msghistory/{id}
     * @secure
     * @response `200` `DsMsghistoryDTO` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `404` `Record<string,string>` Заявка не найдена
     */
    msghistoryDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsMsghistoryDTO, Record<string, string>>({
        path: `/msghistory/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Позволяет пользователю обновить поля своей заявки (возраст, пол, вес, рост).
     *
     * @tags msghistory
     * @name MsghistoryUpdate
     * @summary Обновить данные заявки (авторизованный пользователь)
     * @request PUT:/msghistory/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    msghistoryUpdate: (
      id: number,
      updateData: DsMsghistoryUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/msghistory/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Логически удаляет заявку, переводя ее в статус "удалена".
     *
     * @tags msghistory
     * @name MsghistoryDelete
     * @summary Удалить заявку (авторизованный пользователь)
     * @request DELETE:/msghistory/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    msghistoryDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/msghistory/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Изменяет дополнительное описание для конкретного канала в рамках одной заявки.
     *
     * @tags m-m
     * @name ChannelsUpdate
     * @summary Обновить описание канала в заявке (авторизованный пользователь)
     * @request PUT:/msghistory/{id}/channels/{channel_id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    channelsUpdate: (
      id: number,
      channelId: number,
      updateData: DsChannelToMsghistoryUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/msghistory/${id}/channels/${channelId}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Удаляет связь между заявкой и каналом.
     *
     * @tags m-m
     * @name ChannelsDelete
     * @summary Удалить канал из заявки (авторизованный пользователь)
     * @request DELETE:/msghistory/{id}/channels/{channel_id}
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    channelsDelete: (
      id: number,
      channelId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/msghistory/${id}/channels/${channelId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Переводит заявку из статуса "черновик" в "сформирована".
     *
     * @tags msghistory
     * @name FormUpdate
     * @summary Сформировать заявку (авторизованный пользователь)
     * @request PUT:/msghistory/{id}/form
     * @secure
     * @response `204` `void` No Content
     * @response `400` `Record<string,string>` Не все поля заполнены
     * @response `401` `Record<string,string>` Необходима авторизация
     */
    formUpdate: (id: number, params: RequestParams = {}) =>
      this.request<void, Record<string, string>>({
        path: `/msghistory/${id}/form`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Модератор завершает (с расчетом) или отклоняет заявку.
     *
     * @tags msghistory
     * @name ResolveUpdate
     * @summary Завершить или отклонить заявку (только модератор)
     * @request PUT:/msghistory/{id}/resolve
     * @secure
     * @response `204` `void` No Content
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `403` `Record<string,string>` Доступ запрещен
     */
    resolveUpdate: (
      id: number,
      action: DsMsghistoryResolveRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/msghistory/${id}/resolve`,
        method: "PUT",
        body: action,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  users = {
    /**
     * @description Создает нового пользователя в системе. По умолчанию роль "пользователь", не "модератор".
     *
     * @tags auth
     * @name UsersCreate
     * @summary Регистрация нового пользователя (все)
     * @request POST:/users
     * @response `201` `DsUserDTO` Created
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    usersCreate: (
      credentials: DsUserRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<DsUserDTO, Record<string, string>>({
        path: `/users`,
        method: "POST",
        body: credentials,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает публичные данные пользователя. Требует авторизации.
     *
     * @tags users
     * @name UsersDetail
     * @summary Получение данных пользователя по ID (авторизованный пользователь)
     * @request GET:/users/{id}
     * @secure
     * @response `200` `DsUserDTO` OK
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `404` `Record<string,string>` Пользователь не найден
     */
    usersDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsUserDTO, Record<string, string>>({
        path: `/users/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Обновляет имя пользователя или пароль. Требует авторизации.
     *
     * @tags users
     * @name UsersUpdate
     * @summary Обновление данных пользователя (авторизованный пользователь)
     * @request PUT:/users/{id}
     * @secure
     * @response `204` `void` No Content
     * @response `400` `Record<string,string>` Ошибка валидации
     * @response `401` `Record<string,string>` Необходима авторизация
     * @response `500` `Record<string,string>` Внутренняя ошибка сервера
     */
    usersUpdate: (
      id: number,
      updateData: DsUserUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, Record<string, string>>({
        path: `/users/${id}`,
        method: "PUT",
        body: updateData,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
